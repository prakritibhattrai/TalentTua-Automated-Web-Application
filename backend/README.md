# TalentTua Backend

The TalentTua backend is a Node.js-based API that powers the ResumeFree™ skill-based hiring platform. It manages user and job data, generates Ideal Candidate Profiles (ICPs), and integrates with external APIs and AI models for advanced recruitment workflows.

## Features

- **User Management**: CRUD operations for managing user profiles.
- **Job Management**: APIs for handling job-related data.
- **ICP Generation**: Placeholder endpoint for generating Ideal Candidate Profiles.
- **API Integrations**: Real-time data fetching from Lightcast and O\*NET APIs.
- **Middleware**: Includes CORS, body-parser, and custom middleware for security and request handling.

---

## Installation

### Prerequisites

- Node.js (v16+)
- MySQL
- `.env` file with the following:
  - `DB_URI`: MySQL connection string.
  - `PORT`: Server port (default: 3000).

### Steps

1. Clone the repository:
   ```bash
   git clone <repository_url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables in a .env file:
   ```bash
   DB_URI=your_database_uri
   PORT=3000
   ```
4. Start the server:
   ```bash
   npm start
   ```
