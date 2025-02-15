import sys
import json
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

# ✅ Force UTF-8 encoding on Windows
sys.stdout.reconfigure(encoding='utf-8')

# Load model
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

# Get command line arguments
user_input = sys.argv[1]

# Load job titles from JSON
titles_file = "./data/titles.json"
with open(titles_file, 'r', encoding="utf-8") as file:
    data = json.load(file)

# ✅ Store full job data
job_titles = [f"{job.get('alternate_title', 'Unknown Title')} ({job.get('onetsoc_code', 'Unknown Code')})" for job in data]
job_entries = {i: job for i, job in enumerate(data)}  # Store full job entries with index

# Generate embeddings
job_embeddings = model.encode(job_titles, convert_to_numpy=True)
user_embedding = model.encode([user_input], convert_to_numpy=True)

# Compute similarity
similarities = cosine_similarity(user_embedding, job_embeddings)[0]

# Get best match index
best_idx = np.argmax(similarities)
best_job = job_entries[best_idx]  # Get full job entry

# Extract best match details
best_match_title = best_job.get("alternate_title", "Unknown Title")
best_match_code = best_job.get("onetsoc_code", "Unknown Code")
highest_similarity = float(similarities[best_idx])  # ✅ Convert to Python `float`

# ✅ Fix JSON serialization issue
print(json.dumps({
    "bestMatch": best_match_title,
    "onetsoc_code": best_match_code,
    "similarity": highest_similarity  # ✅ Now a Python `float`, so it works with JSON
}))
