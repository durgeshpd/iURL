🔗 URL Shortener App
A full-stack URL shortening service with user authentication, analytics, and a modern React frontend using React Query, Node.js, MongoDB, and JWT-based Auth.

🚀 Features
🔐 User Auth (Signup / Login / Logout)

🔗 Short URL Generator

📈 Click Analytics (auto-refreshing with React Query)

👤 User Dashboard

🧠 React Query for data fetching & caching

💾 MongoDB with Mongoose

📡 REST API with JWT auth

🎨 Tailwind CSS styling

🛠 Tech Stack
Frontend	Backend	Database
React + Vite	Node.js + Express	MongoDB
React Router	JWT Auth	Mongoose
React Query	bcrypt	
Tailwind CSS	CORS, dotenv	

📁 Project Structure
```css
.
├── client/               # React frontend
│   ├── components/       # Dashboard, Login, Signup
│   ├── context/          # Auth context
│   ├── utils/            # Constants (e.g. BASE_URL)
│   ├── App.jsx
│   └── main.jsx
├── server/               # Node.js backend
│   ├── models/           # User, URL schemas
│   ├── routes/           # Route handlers
│   ├── controllers/      # Logic for API routes
│   └── middleware/       # JWT auth middleware
```

📦 Installation
1. Clone the repo
```bash
git clone https://github.com/yourusername/url-shortener.git
cd url-shortener
```
2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Fill in MONGO_URI and JWT_SECRET in .env
npm start
```
3. Frontend Setup
```bash
cd ../client
npm install
npm run dev
```
🔑 Environment Variables
Create a .env file in the server/ folder with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

🔗 API Endpoints (Backend)

Method	Endpoint	Description
POST	/signup	Register a new user
POST	/login	Login user, return JWT
GET	/user/profile	Get logged-in user's info
GET	/user/urls	Get user's short URLs
POST	/url	Create a short URL
GET	/url/:shortId	Redirect + track click
GET	/analytics/:id	Get click history

📌 Notes

React Query auto-refreshes click stats every 5 seconds

Clicks are tracked via visitedHistory[] with timestamps

Tokens are stored in localStorage securely

📬 Contact

Feel free to open an issue or submit a pull request if you have ideas or improvements.