# Smart Job Tracker - Full Stack Application

A complete full-stack application for tracking job applications with user authentication. Built with React, Node.js, Express, MongoDB, and JWT.

## 📁 Project Structure

```
Smart_Job_Tracker/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components (Navbar, ProtectedRoute)
│   │   ├── pages/           # Page components (Login, Signup, Dashboard)
│   │   ├── styles/          # CSS modules for styling
│   │   ├── utils/           # Utility functions (API config)
│   │   ├── App.jsx          # Main app with router setup
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   └── ROUTER_SETUP.md      # Frontend documentation
├── config/
│   └── database.js          # MongoDB connection configuration
├── controllers/
│   ├── authController.js    # Authentication logic (register, login, profile)
│   └── jobController.js     # Job CRUD operations and statistics
├── middleware/
│   └── auth.js              # JWT authentication & authorization middleware
├── models/
│   ├── User.js              # User schema with password hashing
│   └── Job.js               # Job schema with tracking fields
├── routes/
│   ├── authRoutes.js        # Authentication endpoints
│   └── jobRoutes.js         # Job management endpoints
├── utils/
│   └── jwt.js               # JWT token generation and verification
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── package.json             # Backend dependencies
├── server.js                # Backend entry point
└── README.md                # Project documentation
```

## 🚀 Features

### Authentication
- User registration with password hashing (bcrypt)
- User login with JWT token generation
- Protected routes with JWT verification
- Profile management (update profile, change password)

### Job Tracking
- Create, read, update, delete job applications
- **Filter jobs by status** (Applied, Interview, Rejected, Selected)
- **Search by company name** (case-insensitive)
- **Pagination support** (customizable page size)
- Job statistics and analytics
- Track company name, role, applied date, and notes
- User-specific job management

## 📦 Installation

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Smart_Job_Tracker
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   copy .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/smart-job-tracker
   JWT_SECRET=your_secure_jwt_secret_key
   JWT_EXPIRE=30d
   CORS_ORIGIN=http://localhost:5173
   ```
   
   📖 **For detailed environment configuration, see [ENV_SETUP.md](ENV_SETUP.md)**

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the backend server**
   
   Development mode (with nodemon):
   ```bash
   npm run dev
   ``` 
   
   
   Production mode:
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Run the frontend development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

For detailed frontend documentation, see [`client/ROUTER_SETUP.md`](client/ROUTER_SETUP.md)

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| GET | `/me` | Get current user | Private |
| PUT | `/profile` | Update user profile | Private |
| PUT | `/password` | Change password | Private |

### Job Routes (`/api/jobs`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all jobs (with filters) | Private |
| GET | `/:id` | Get single job | Private |
| POST | `/` | Create new job | Private |
| PUT | `/:id` | Update job | Private |
| DELETE | `/:id` | Delete job | Private |
| GET | `/stats/summary` | Get job statistics | Private |

## 📝 API Usage Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Job (Protected)
```bash
POST /api/jobs
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "companyName": "Tech Corp",
  "role": "Senior Developer",
  "status": "Applied",
  "appliedDate": "2024-01-15",
  "notes": "Applied through company website. Waiting for response."
}
```

### Get All Jobs with Filters, Search & Pagination
```bash
# Filter by status
GET /api/jobs?status=Interview
Authorization: Bearer <your_jwt_token>

# Search by company name
GET /api/jobs?search=Google
Authorization: Bearer <your_jwt_token>

# Pagination (default: page=1, limit=10)
GET /api/jobs?page=2&limit=20
Authorization: Bearer <your_jwt_token>

# Combined filters
GET /api/jobs?status=Applied&search=Tech&page=1&limit=10
Authorization: Bearer <your_jwt_token>
```

**Response includes:**
- `count` - Number of jobs in current page
- `total` - Total number of jobs matching query
- `page` - Current page number
- `pages` - Total number of pages

### Get Job Statistics for Dashboard
```bash
GET /api/jobs/stats/summary
Authorization: Bearer <your_jwt_token>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "total": 45,
    "stats": [
      { "_id": "Applied", "count": 20 },
      { "_id": "Interview", "count": 10 },
      { "_id": "Selected", "count": 5 },
      { "_id": "Rejected", "count": 10 }
    ]
  }
}
```

## 🗄️ Database Models

### User Model
- name (String, required)
- email (String, required, unique)
- password (String, required, hashed with bcrypt)
- timestamps (createdAt, updatedAt)

### Job Model
- user (ObjectId, ref: User, required)
- companyName (String, required)
- role (String, required)
- status (String, enum: Applied/Interview/Rejected/Selected, default: Applied)
- appliedDate (Date, default: Date.now)
- notes (String, max 1000 chars)
- timestamps (createdAt, updatedAt)

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected routes with middleware
- Input validation
- CORS enabled
- Environment variables for sensitive data

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool and dev server
- **CSS3** - Styling with modern features

## 📄 License

ISC

## 👤 Author

Your Name

---

**Note**: Make sure to change the JWT_SECRET in production to a secure random string!
