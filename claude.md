# AI-Powered Finance Dashboard - Project Setup Guide for Claude Code

## 📋 Project Overview

This is a personal finance dashboard application built with FastAPI (backend) and React (frontend). The project follows a staged implementation approach, starting simple and gradually adding features.

## 🎯 Current Goal: Stage 1 - Basic CRUD Application

Build a working finance tracker with:
- User authentication (JWT)
- Transaction management (CRUD)
- Simple dashboard
- PostgreSQL database
- Basic REST API

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI 0.104.1
- **Database**: PostgreSQL 15
- **ORM**: SQLAlchemy 2.0.23
- **Authentication**: JWT (python-jose, passlib)
- **Validation**: Pydantic 2.5.0
- **Server**: Uvicorn 0.24.0

### Frontend (Stage 1 - Keep Simple)
- **Framework**: React 18 with Vite
- **Language**: JavaScript (TypeScript optional for later)
- **Styling**: Basic CSS (TailwindCSS in Stage 4)

### Database
- **PostgreSQL**: Version 15
- **Tables**: users, transactions (Stage 1)
- **Future**: budgets (Stage 2), category_keywords (Stage 3)

## 📁 Required Project Structure

```
finance-dashboard/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                      # FastAPI application entry point
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── v1/
│   │   │       ├── __init__.py
│   │   │       ├── router.py            # Main API router
│   │   │       └── endpoints/
│   │   │           ├── __init__.py
│   │   │           ├── auth.py          # Register, login endpoints
│   │   │           ├── transactions.py  # Transaction CRUD
│   │   │           └── dashboard.py     # Dashboard summary
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py                # Settings and environment variables
│   │   │   ├── security.py              # JWT token functions
│   │   │   └── deps.py                  # FastAPI dependencies
│   │   ├── db/
│   │   │   ├── __init__.py
│   │   │   └── session.py               # Database connection and session
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── user.py                  # User SQLAlchemy model
│   │   │   └── transaction.py           # Transaction SQLAlchemy model
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── user.py                  # User Pydantic schemas
│   │   │   ├── transaction.py           # Transaction Pydantic schemas
│   │   │   └── token.py                 # JWT token schemas
│   │   └── services/
│   │       ├── __init__.py
│   │       ├── auth_service.py          # Authentication business logic
│   │       └── transaction_service.py   # Transaction business logic
│   ├── alembic/                         # Database migrations (optional for Stage 1)
│   ├── tests/                           # Pytest tests
│   │   ├── __init__.py
│   │   ├── test_auth.py
│   │   └── test_transactions.py
│   ├── requirements.txt                 # Python dependencies
│   ├── .env.example                     # Example environment variables
│   ├── .env                            # Actual environment variables (gitignored)
│   └── README.md
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── TransactionList.jsx
│   │   │   ├── TransactionForm.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Home.jsx
│   │   │   └── Transactions.jsx
│   │   ├── services/
│   │   │   └── api.js                   # Axios API calls
│   │   ├── utils/
│   │   │   └── auth.js                  # JWT token management
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── .gitignore
├── README.md
├── CLAUDE.md                            # This file
└── docker-compose.yml                   # Optional: for local PostgreSQL

```

## 🔧 Environment Variables Required

Create `backend/.env` file with:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/finance_db

# JWT
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Application
API_V1_PREFIX=/api/v1
DEBUG=True

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 📦 Dependencies

### Backend Requirements (requirements.txt)

```txt
# Core FastAPI
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6

# Database
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
alembic==1.12.1

# Authentication
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4

# Configuration
python-dotenv==1.0.0
pydantic==2.5.0
pydantic-settings==2.1.0

# Development
pytest==7.4.3
pytest-asyncio==0.21.1
httpx==0.25.1
```

### Frontend Dependencies (package.json)

```json
{
  "name": "finance-dashboard-frontend",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}
```

## 🗄️ Database Schema (Stage 1)

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Transactions Table
```sql
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    category VARCHAR(50) NOT NULL,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
```

### Categories (Hardcoded in Stage 1)
```python
CATEGORIES = [
    "Food & Dining",
    "Shopping",
    "Transportation",
    "Bills & Utilities",
    "Entertainment",
    "Healthcare",
    "Education",
    "Personal Care",
    "Travel",
    "Income",
    "Other"
]
```

## 🚀 API Endpoints (Stage 1)

### Authentication
```
POST   /api/v1/auth/register
       Body: { "email": "user@example.com", "password": "password123", "full_name": "John Doe" }
       Returns: { "access_token": "...", "token_type": "bearer" }

POST   /api/v1/auth/login
       Body: { "email": "user@example.com", "password": "password123" }
       Returns: { "access_token": "...", "token_type": "bearer" }

GET    /api/v1/auth/me
       Headers: { "Authorization": "Bearer <token>" }
       Returns: { "id": 1, "email": "user@example.com", "full_name": "John Doe" }
```

### Transactions
```
GET    /api/v1/transactions
       Headers: { "Authorization": "Bearer <token>" }
       Query: ?skip=0&limit=20&type=expense&category=Food
       Returns: [ { "id": 1, "amount": 50.00, "description": "Lunch", ... } ]

POST   /api/v1/transactions
       Headers: { "Authorization": "Bearer <token>" }
       Body: {
           "amount": 50.00,
           "description": "Lunch at cafe",
           "type": "expense",
           "category": "Food & Dining",
           "transaction_date": "2024-01-15"
       }
       Returns: { "id": 1, "amount": 50.00, ... }

GET    /api/v1/transactions/{transaction_id}
       Headers: { "Authorization": "Bearer <token>" }
       Returns: { "id": 1, "amount": 50.00, ... }

PUT    /api/v1/transactions/{transaction_id}
       Headers: { "Authorization": "Bearer <token>" }
       Body: { "amount": 55.00, "description": "Updated lunch" }
       Returns: { "id": 1, "amount": 55.00, ... }

DELETE /api/v1/transactions/{transaction_id}
       Headers: { "Authorization": "Bearer <token>" }
       Returns: { "message": "Transaction deleted successfully" }
```

### Dashboard
```
GET    /api/v1/dashboard/summary
       Headers: { "Authorization": "Bearer <token>" }
       Returns: {
           "total_income": 5000.00,
           "total_expense": 3500.00,
           "balance": 1500.00,
           "recent_transactions": [...],
           "expenses_by_category": {
               "Food & Dining": 500.00,
               "Transportation": 300.00,
               ...
           }
       }
```

## ✅ Pre-Setup Checklist

Before starting, ensure you have:

- [ ] Python 3.11+ installed (`python --version`)
- [ ] Node.js 18+ installed (`node --version`)
- [ ] PostgreSQL 15+ installed and running
- [ ] Git installed
- [ ] Code editor (VS Code recommended)
- [ ] PostgreSQL database created: `finance_db`
- [ ] PostgreSQL user created with access to the database

## 🎯 Implementation Tasks for Claude Code

### Phase 1: Project Structure Setup
- [ ] Create root directory `finance-dashboard`
- [ ] Create all subdirectories as per structure above
- [ ] Create all `__init__.py` files for Python packages
- [ ] Create `.gitignore` file
- [ ] Create `README.md` files

### Phase 2: Backend Setup
- [ ] Create `requirements.txt` with all dependencies
- [ ] Create `.env.example` file
- [ ] Set up `app/core/config.py` with Pydantic Settings
- [ ] Set up `app/db/session.py` for database connection
- [ ] Create User model in `app/models/user.py`
- [ ] Create Transaction model in `app/models/transaction.py`
- [ ] Create Pydantic schemas for User, Transaction, Token
- [ ] Implement JWT authentication in `app/core/security.py`
- [ ] Create authentication endpoints in `app/api/v1/endpoints/auth.py`
- [ ] Create transaction endpoints in `app/api/v1/endpoints/transactions.py`
- [ ] Create dashboard endpoint in `app/api/v1/endpoints/dashboard.py`
- [ ] Set up main router in `app/api/v1/router.py`
- [ ] Create FastAPI app in `app/main.py`
- [ ] Add CORS middleware
- [ ] Set up automatic API documentation

### Phase 3: Frontend Setup
- [ ] Initialize Vite React project
- [ ] Create `package.json` with dependencies
- [ ] Set up routing with React Router
- [ ] Create Axios API service
- [ ] Create auth utility functions (JWT storage)
- [ ] Create Login page component
- [ ] Create Register page component
- [ ] Create Dashboard page component
- [ ] Create Transactions page component
- [ ] Create TransactionList component
- [ ] Create TransactionForm component
- [ ] Create Navbar component
- [ ] Add basic CSS styling
- [ ] Connect frontend to backend API

### Phase 4: Testing & Documentation
- [ ] Write pytest tests for auth endpoints
- [ ] Write pytest tests for transaction endpoints
- [ ] Test all API endpoints with Postman/Thunder Client
- [ ] Test frontend user flows
- [ ] Update README with setup instructions
- [ ] Create API documentation

## 🔒 Security Considerations

1. **Password Hashing**: Use bcrypt via passlib
2. **JWT Tokens**: Sign with strong SECRET_KEY
3. **SQL Injection**: Protected by SQLAlchemy ORM
4. **CORS**: Configure specific origins only
5. **Environment Variables**: Never commit `.env` file
6. **Input Validation**: Use Pydantic models

## 🐛 Common Issues & Solutions

### Database Connection Issues
```bash
# Check PostgreSQL is running
sudo service postgresql status

# Create database manually if needed
psql -U postgres
CREATE DATABASE finance_db;
\q
```

### Port Already in Use
```bash
# Backend (Port 8000)
lsof -ti:8000 | xargs kill -9

# Frontend (Port 5173)
lsof -ti:5173 | xargs kill -9
```

### Migration Issues
```bash
# Reset database if needed
cd backend
alembic downgrade base
alembic upgrade head
```

## 🧪 Testing Commands

### Backend
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run tests
pytest

# Check code
python -m pytest tests/ -v
```

### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

## 📚 Important Notes

1. **Stage 1 Focus**: Keep it simple - no Redis, no ML, no Celery yet
2. **Database**: Use PostgreSQL, not SQLite (easier migration later)
3. **Authentication**: JWT tokens stored in localStorage (frontend)
4. **API Versioning**: Use `/api/v1` prefix for future-proofing
5. **Error Handling**: Return proper HTTP status codes
6. **Validation**: Let Pydantic handle all validation
7. **Documentation**: FastAPI auto-generates Swagger docs at `/docs`

## 🎓 Learning Resources

- **FastAPI**: https://fastapi.tiangolo.com/tutorial/
- **SQLAlchemy**: https://docs.sqlalchemy.org/en/20/tutorial/
- **Pydantic**: https://docs.pydantic.dev/latest/
- **React**: https://react.dev/learn
- **Vite**: https://vitejs.dev/guide/

## 🚦 Success Criteria for Stage 1

Stage 1 is complete when:
- ✅ User can register and login
- ✅ JWT authentication works
- ✅ User can create transactions
- ✅ User can view all their transactions
- ✅ User can edit transactions
- ✅ User can delete transactions
- ✅ Dashboard shows total income, expense, and balance
- ✅ Dashboard shows recent transactions
- ✅ Frontend and backend communicate successfully
- ✅ App can be deployed to Railway
- ✅ All tests pass

## 🎯 Next Stages (Future)

- **Stage 2**: Add Redis caching + Budget tracking
- **Stage 3**: Smart categorization (keyword matching)
- **Stage 4**: Beautiful UI with TailwindCSS + Recharts
- **Stage 5**: Email notifications + Background tasks
- **Stage 6**: Optional ML/AI features

## 💬 Commands for Claude Code

When using Claude Code, you can use these commands:

```bash
# Setup entire project structure
"Create the complete project structure for Stage 1 as outlined in CLAUDE.md"

# Create backend files
"Create all backend models, schemas, and endpoints for authentication and transactions"

# Create frontend files
"Create React components for login, register, dashboard, and transactions"

# Fix issues
"Fix the authentication issue in auth.py"

# Add features
"Add pagination to the transactions list endpoint"

# Run tests
"Create pytest tests for all API endpoints"
```

## 📞 Support

If you encounter issues:
1. Check this CLAUDE.md file
2. Check the error logs
3. Verify environment variables in .env
4. Ensure PostgreSQL is running
5. Check that all dependencies are installed

---

**Remember**: Start simple with Stage 1, get it working, then iterate! Don't try to build everything at once.

**Current Goal**: Build Stage 1 - A working CRUD app with auth and transactions. That's it!

Good luck! 🚀
