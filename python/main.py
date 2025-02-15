import json
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import faiss  # Import FAISS for fast search
from typing import Dict, Any, List, Optional
from sklearn.preprocessing import normalize
import time
# Initialize FastAPI app
app = FastAPI()
# Load Sentence Transformer model
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

# Load job titles from titles.json
titles_file = "titles.json"
with open(titles_file, 'r', encoding="utf-8") as file:
    data = json.load(file)

# Load technology data from tech.json
tech_file = "tech.json"
with open(tech_file, 'r', encoding="utf-8") as file:
    tech_data = json.load(file)
# Extract technical languages and frameworks from tech.json
tech_titles = [tech['example'] for tech in tech_data]  # Assuming 'example' field has the tech names
tech_entries = {i: tech for i, tech in enumerate(tech_data)}  # Store tech entries with index
# Precompute embeddings for technologies
tech_embeddings = model.encode(tech_titles, convert_to_numpy=True)

# Convert tech embeddings to float32 (required by FAISS)
tech_embeddings = np.array(tech_embeddings, dtype=np.float32)

# Normalize tech embeddings for cosine similarity
faiss.normalize_L2(tech_embeddings)

# Create FAISS index for tech embeddings (L2 distance for cosine similarity)
index = faiss.IndexFlatL2(tech_embeddings.shape[1])
index.add(tech_embeddings)  # Add embeddings to the index
# Store full job data and prepare job titles
job_titles = [f"{job.get('alternate_title', 'Unknown Title')} ({job.get('onetsoc_code', 'Unknown Code')})" for job in data]
job_entries = {i: job for i, job in enumerate(data)}  # Store full job entries with index

# Precompute embeddings for job titles
job_embeddings = model.encode(job_titles, convert_to_numpy=True)

# Convert job embeddings to float32 (required by FAISS)
job_embeddings = np.array(job_embeddings, dtype=np.float32)

# Normalize job embeddings for cosine similarity
faiss.normalize_L2(job_embeddings)

# Create FAISS index (using L2 distance, which is common for cosine similarity)
index = faiss.IndexFlatL2(job_embeddings.shape[1])  # L2 distance for cosine similarity
index.add(job_embeddings)  # Add embeddings to the index

# Cache for storing computed embeddings
embedding_cache = {}


#------------------------------TECHNICAL MATCHING--------------------
#------------------------------JOB TITLE MATCHING--------------------



class JobTitleRequest(BaseModel):
    job_title: str

@app.post("/match-job-title")
async def match_job_title(request: JobTitleRequest):
    try:
        start_time = time.time()
        job_title = request.job_title

        # 🚀 Encode input & convert to float32
        job_embedding = np.array(model.encode([job_title]), dtype=np.float32)
        faiss.normalize_L2(job_embedding)

        # 🚀 Perform FAISS search
        distances, indices = index.search(job_embedding, k=5)
        indices = indices.astype(int)  # Convert np.int64 to int

        # 🚀 Retrieve top matches
        results = [
            {
                "technology": tech_entries[idx].get("example", "Unknown Technology"),
                "similarity_score": round(float(dist), 4),
            }
            for idx, dist in zip(indices[0], distances[0]) if idx >= 0
        ]

        processing_time = round(time.time() - start_time, 3)

        return {
            "jobTitle": job_title,
            "processingTime": processing_time,
            "topTechnologies": results,
        }

    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        raise HTTPException(status_code=500, detail=f"Error occurred:\n{error_details}")
class EducationExpertise(BaseModel):
    knowledge: list[str] = []

class OnetDataRequest(BaseModel):
    jobTitle: str
    industry: str
    jobDescription: str = ""
    educationExpertise: EducationExpertise

@app.post("/process-onet-data")
async def process_onet_data(request: OnetDataRequest):
    try:
        start_time = time.time()  # Start measuring time

        job_title = request.jobTitle
        industry = request.industry
        job_description = request.jobDescription
        context = f"{job_title} - {industry}. {job_description}"

        # Get knowledge data or generate new ones
        knowledge_data = request.educationExpertise.knowledge
        if not knowledge_data:
            knowledge_data = generate_knowledge_domains(job_title, job_description)

        print(f"Knowledge Data: {knowledge_data}")

        # Rank knowledge domains with caching
        ranked_knowledge = rank_relevant_data("Knowledge", knowledge_data, context)

        end_time = time.time()  # Stop measuring time
        print(f"Processing Time: {round(end_time - start_time, 2)} seconds")

        return {
            "jobTitle": job_title,
            "industry": industry,
            "processingTime": round(end_time - start_time, 2),
            "sortedKnowledge": ranked_knowledge,  # Now sorted from least to most relevant
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing data: {e}")

def get_cached_embedding(text):
    """ Retrieves or caches embeddings to avoid recomputation. """
    if text in embedding_cache:
        return embedding_cache[text]
    else:
        embedding = normalize(model.encode([text], convert_to_numpy=True))
        embedding_cache[text] = embedding
        return embedding

def rank_relevant_data(category_name, data_list, context):
    if not data_list:
        return []

    # Extract text from knowledge data
    text_data = []
    for item in data_list:
        if isinstance(item, str):
            text_data.append(item)
        elif isinstance(item, dict) and "title" in item and "name" in item["title"]:
            text_data.append(item["title"]["name"])

    print(f"Extracted Knowledge Data: {text_data}")

    # Retrieve or compute context embedding
    context_embedding = get_cached_embedding(context)

    # Retrieve or compute embeddings for knowledge data
    data_embeddings = np.array([get_cached_embedding(text).flatten() for text in text_data])

    # Use FAISS for fast similarity search
    index = faiss.IndexFlatL2(data_embeddings.shape[1])
    index.add(data_embeddings)
    D, I = index.search(context_embedding, len(text_data))

    # Rank knowledge domains by similarity (low to high)
    ranked_data = [(text_data[i], D[0][j]) for j, i in enumerate(I[0])]

    print(f"Ranked Knowledge (Low to High): {ranked_data}")

    # ✅ Fix: Convert NumPy float to Python float before returning
    return [{"knowledge": item[0], "score": round(float(item[1]), 4)} for item in ranked_data]

def generate_knowledge_domains(job_title, job_description):
    """
    Generates relevant knowledge domains using a pre-trained model and predefined categories.
    """
    base_domains = ["Software Engineering", "Data Structures", "Algorithms", "Machine Learning",
                    "Cybersecurity", "Cloud Computing", "Databases", "Networking", "Artificial Intelligence",
                    "DevOps", "Web Development", "Mobile Development", "Embedded Systems"]

    # Compute context embedding (cached)
    context_embedding = get_cached_embedding(f"{job_title}. {job_description}")

    # Compute embeddings for base knowledge domains (cached)
    domain_embeddings = np.array([get_cached_embedding(domain).flatten() for domain in base_domains])

    # Use FAISS for similarity search
    index = faiss.IndexFlatL2(domain_embeddings.shape[1])
    index.add(domain_embeddings)
    D, I = index.search(context_embedding, 5)  # Get top 5 relevant domains

    # Get top 5 most relevant domains
    sorted_domains = [(base_domains[i], D[0][j]) for j, i in enumerate(I[0])]

    print(f"Generated Knowledge Domains: {sorted_domains}")

    return [domain[0] for domain in sorted_domains]


# Request model to capture user input
class JobRequest(BaseModel):
    user_input: str

# Function to filter technologies by hot_technology and in_demand
def categorize_tech_jobs(tech_data, job_code):
    # Filter tech data for the specific onetsoc_code
    filtered_tech = [tech for tech in tech_data if tech.get('onetsoc_code') == job_code]
    
    # Categorize into Hot, In-Demand, and Both
    hot_techs = []
    in_demand_techs = []
    both_techs = []

    for tech in filtered_tech:
        if tech.get('hot_technology') == "Y" and tech.get('in_demand') == "Y":
            both_techs.append(tech)
        elif tech.get('hot_technology') == "Y":
            hot_techs.append(tech)
        elif tech.get('in_demand') == "Y":
            in_demand_techs.append(tech)

    return hot_techs, in_demand_techs, both_techs


# API Endpoint for Job Matching
@app.post("/match-job")
async def match_job(request: JobRequest):
    try:
        # Step 1: Encode user input into an embedding and find the most similar job title using FAISS
        user_embedding = model.encode([request.user_input])

        # Convert user embedding to float32 (required by FAISS)
        user_embedding = np.array(user_embedding, dtype=np.float32)

        # Normalize user input embedding before searching
        faiss.normalize_L2(user_embedding)

        # Perform search for the most similar job title using FAISS
        distances, indices = index.search(user_embedding, k=1)  # k=1 for the best match

        # Get the index of the best match job
        best_idx = indices[0][0]
        best_job = job_entries[best_idx]

        # Extract details of the best match job
        best_match_title = best_job.get("alternate_title", "Unknown Title")
        best_match_code = best_job.get("onetsoc_code", "Unknown Code")
        highest_similarity = float(distances[0][0])  # FAISS distance is converted to float

        # Step 2: Find relevant technologies based on the onetsoc_code of the matched job
        hot_techs, in_demand_techs, both_techs = categorize_tech_jobs(tech_data, best_match_code)

        # If no technologies are found for the matched job, return an error
        if not hot_techs and not in_demand_techs and not both_techs:
            raise HTTPException(status_code=404, detail="No matching technologies found for the job title.")

        # Step 3: Return the best match job and categorized technologies
        return {
            "bestMatch": best_match_title,
            "onetsoc_code": best_match_code,
            "similarity": highest_similarity,
            "technologies": {
                "hot_technology": [{
                    "example": tech.get("example", "No example available"),
                    "commodity_code": tech.get("commodity_code", "N/A"),
                    "in_demand": tech.get("in_demand", "N")
                } for tech in hot_techs],
                "in_demand_technology": [{
                    "example": tech.get("example", "No example available"),
                    "commodity_code": tech.get("commodity_code", "N/A"),
                    "hot_technology": tech.get("hot_technology", "N")
                } for tech in in_demand_techs],
                "both_hot_and_in_demand": [{
                    "example": tech.get("example", "No example available"),
                    "commodity_code": tech.get("commodity_code", "N/A"),
                } for tech in both_techs]
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error occurred: {e}")

    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
