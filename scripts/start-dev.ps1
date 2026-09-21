Write-Host "Starting MineSight Development Servers..." -ForegroundColor Green

# Start the Backend Server in a new window
Write-Host "Starting FastAPI Backend on port 8000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; if (!(Test-Path .venv)) { python -m venv .venv; .\.venv\Scripts\Activate.ps1; pip install -r requirements.txt }; .\.venv\Scripts\Activate.ps1; uvicorn app.main:app --reload --port 8000"

# Start the Frontend Server in a new window
Write-Host "Starting React Frontend on port 5173..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; if (!(Test-Path node_modules)) { npm install }; npm run dev"

Write-Host "Both servers are starting up in separate windows." -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "Backend API: http://localhost:8000" -ForegroundColor Yellow
