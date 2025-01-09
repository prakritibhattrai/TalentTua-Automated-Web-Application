import React, { useState } from "react";

const EditableSummary = () => {
  const initialData = {
    jobTitle: "adsasd",
    jobFamily: "asdasd",
    industry: "Waste management and remediation services",
    seniorityLevel: "Entry level - very limited proficiency, willing to learn",
    stakeholderEngagement: [
      "Internal team or department",
      "Suppliers, vendors, or other business supports",
    ],
    traitMatrix: {
      "Direct communication": 2,
      "Tactful communication": 2,
      "Certain of opinion": 2,
      "Open to others' opinions": 2,
      "Seeks to improve self": 3,
      "Positive self-identity": 3,
      "Puts own needs first": 4,
      "Puts others' needs first": 3,
      "Fact-finding decision making": 4,
      "Intuition based decision making": 3,
      "Self motivated": 3,
      "Manages stress well": 3,
      "Persistence against work barriers": 4,
      "Experimenting against work barriers": 4,
      "Organized work style": 4,
      "Flexible work style": 4,
      "Analyzing pitfalls": 4,
      "Comfortable with uncertain outcomes": 4,
      "Rule enforcing": 4,
      "Friendly demeanor": 4,
      Collaborative: 4,
      "Independent decision making": 4,
      Optimistic: 4,
    },
    desirableSoftSkills: ["Time Management", "Emotional Intelligence"],
    undesirableTraits: ["Lack of initiative", "Disorganization"],
    toolProficiencies: ["Excel", "Data visualization tools"],
    roleDescription: "asdasdasd",
    reviewAndUpdate: "asdasdasd",
  };

  const [data, setData] = useState(initialData);

  // Handle saving the data (just logging here)
  const handleSave = (e) => {
    e.preventDefault();
    console.log("Data saved", data); // You can replace this with a save function (e.g., API call)
  };

  return (
    <div
      className="mt-4 space-y-10"
      style={{
        maxHeight: "400px",
        overflowY: "scroll",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>
        Job Profile Summary
      </h1>
      <h3>Summary:</h3>
      <div>
        <p>
          <strong>Job Title:</strong> {data.jobTitle}
        </p>
        <p>
          <strong>Job Family:</strong> {data.jobFamily}
        </p>
        <p>
          <strong>Industry:</strong> {data.industry}
        </p>
        <p>
          <strong>Seniority Level:</strong> {data.seniorityLevel}
        </p>

        <p>
          <strong>Stakeholder Engagement:</strong>{" "}
          {data.stakeholderEngagement.join(", ")}
        </p>

        <p>
          <strong>Desirable Soft Skills:</strong>{" "}
          {data.desirableSoftSkills.join(", ")}
        </p>
        <p>
          <strong>Undesirable Traits:</strong>{" "}
          {data.undesirableTraits.join(", ")}
        </p>
        <p>
          <strong>Tool Proficiencies:</strong>{" "}
          {data.toolProficiencies.join(", ")}
        </p>
        <p>
          <strong>Role Description:</strong> {data.roleDescription}
        </p>
        <p>
          <strong>Review and Update:</strong> {data.reviewAndUpdate}
        </p>

        <h4>Trait Matrix:</h4>
        {Object.keys(data.traitMatrix).map((trait, index) => (
          <div key={index}>
            <p>
              <strong>{trait}:</strong> {data.traitMatrix[trait]}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        style={{
          padding: "8px",
          fontSize: "14px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditableSummary;
