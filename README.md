# MineSight

**Mining & Reporting Intelligence Platform**

MineSight is a complete, user-friendly web application for AI-Powered Geological, Mining, and Other Reporting for CMPDI/CIL Subsidiaries. This prototype demonstrates the complete solution from document upload to report generation using mock/synthetic data.

## Features

*   **Upload Documents**: Drag & Drop or browse to upload various document types. Simulated processing pipeline.
*   **Check Data**: Validate extracted information to ensure completeness and consistency.
*   **Find & Resolve Differences**: Compare conflicting information across documents side-by-side and resolve discrepancies (e.g., unit conversions, manual review).
*   **Smart Search**: Search across all uploaded documents, extracted information, reports, and topics using keyword matching.
*   **Ask AI**: A chat interface to ask questions about the documents in the system with full traceability to source documents.
*   **Topics & Word Cloud**: Visualize the main subjects and common words discussed in the documents.
*   **Reports**: Generate professional reports (Production, Geological, Safety, etc.) using checked information and export them to PDF, DOCX, CSV, or JSON.
*   **Analytics**: View production trends, target vs. actual, and more on interactive charts.
*   **Activity History**: Track who did what and when for full auditability.

## Technology Stack

*   **Frontend**: React, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons.
*   **Backend**: Python, FastAPI, SQLAlchemy, Pydantic.
*   **Database**: SQLite (local, persistent mock data).

## Folder Structure

```
minesight/
├── frontend/          # React + Vite frontend application
├── backend/           # FastAPI backend application
├── scripts/           # Python and PowerShell helper scripts
├── data/              # SQLite database storage
├── generated_reports/ # Output folder for generated report exports
├── docker-compose.yml # Docker setup
└── README.md          # This file
```

## Installation & Setup

You can run the application using Docker, or locally on your machine.

### Option 1: Docker (Recommended)

1. Ensure Docker is installed and running.
2. Run the following command in the root directory:
   ```powershell
   docker compose up --build
   ```
3. The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:8000`.

### Option 2: Local Development

**Prerequisites:** Python 3.10+ and Node.js.

1. **Backend Setup:**
   ```powershell
   cd backend
   python -m venv .venv
   .venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8000
   ```
2. **Frontend Setup:**
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

### Quick Start Script

For the easiest developer experience, run the provided script from the root directory:
```powershell
.\scripts\start-dev.ps1
```

## Database Seeding & Reset

The application uses an SQLite database (`data/minesight.db`) to ensure that data is persistent and dynamic during demonstrations.

To generate the initial mock data (which includes 50+ documents, multiple subsidiaries, exact test cases for differences, etc.), run:
```powershell
python scripts/seed_data.py
```

To reset the data back to its original state, you can run the reset script (if implemented) or simply delete `data/minesight.db` and run the seed script again.

## Demo Accounts

Use these credentials to log in and test role-based access:

*   **Admin**: `admin` / `admin123`
*   **Reporting Officer**: `reporting` / `report123`
*   **Analyst**: `analyst` / `analyst123`
*   **Viewer**: `viewer` / `viewer123`

## Complete Demo Flow

1.  Log in as **Reporting Officer**.
2.  Navigate to **Dashboard** to view dynamic statistics.
3.  Go to **Documents** and mock-upload an `Annual_Mining_Report_2024.pdf`.
4.  Navigate to **Check Data** to review extracted info.
5.  Go to **Differences** to see conflicting reports (e.g., 5.2 MT vs 5.8 MT) and resolve them (e.g., matching 5.2 MT to 5,200,000 KG).
6.  Use **Smart Search** for "production of MCL in 2024".
7.  Go to **Ask AI** and ask "What was MCL production in 2024?" to see a source-backed answer.
8.  Explore **Topics** and **Analytics**.
9.  Go to **Reports**, generate a Production Report for MCL 2024, and export it.
10. Check **Activity History** to verify all actions were recorded.

## Future Integration

This prototype is built with clear service boundaries. The mock data services can be replaced with authentic CMPDI/CIL data, a real OCR pipeline, a vector database for Smart Search, and a real LLM for the Ask AI feature without requiring a complete rewrite of the frontend or core API structure.
