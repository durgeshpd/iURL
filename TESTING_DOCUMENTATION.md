✅ Test Cases Documentation – URL Shortener App (Full Stack)

📁 Project Overview

This is a full-stack URL shortener app with authentication. Below are the details of the test cases written for:

Frontend (React + React Testing Library + MSW + Vitest)

Backend (Node.js + Express + MongoDB + Jest + Supertest + MongoMemoryServer)

🧪 Frontend Test Cases

📦 Tools & Setup

Testing Library: @testing-library/react, @testing-library/jest-dom

Mocking & Utils: vitest, msw, axios

State/Network: React Query, AuthContext

Routing: React Router

🧩 Components Tested
1. Dashboard.jsx
✅ Features Covered
Feature	Description
Profile data fetch	Name and email shown from /user/profile
Shortened URL fetch	Lists previously created URLs from /user/urls
Generate short URL	Submits long URL and shows generated short URL
Input validation	Shows error if input is empty
API error handling	Shows error if backend fails
Logout functionality	Calls logout function from context

🧪 Sample Test Cases
```js

expect(screen.getByText("Durgesh")).toBeInTheDocument();
expect(screen.getByText("https://google.com")).toBeInTheDocument();
expect(screen.getByText("42")).toBeInTheDocument();
```

2. Login.jsx
✅ Features Covered
Feature	Description
Form rendering	Ensures email/password inputs & buttons exist
Valid login	Calls API and triggers login(token) on success
Invalid login	Mocks failure and displays error

🧪 Sample Test Cases
```js

expect(axios.post).toHaveBeenCalledWith(expect.stringContaining("/user/login"), {
  email: "test@example.com",
  password: "password123",
});
```

🧩 MSW Handlers
Mock API handlers are set up using msw:

/user/login → Auth

/user/profile → Profile info

/user/urls → URL list

/url → Generate short URL

🧩 Global Setup (Test Lifecycle)
In setupTests.js:

```js
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

🔧 Backend Test Cases
📦 Tools & Setup
Testing Framework: jest

API Testing: supertest

Database: mongodb-memory-server

App Structure: /controllers, /routes, /models, /tests

🧩 Test Files
1. auth.test.js
✅ Features Covered
Feature	Description
Signup	Creates new user, returns userId
Login	Returns token for valid credentials

🧪 Sample Assertion
```js

expect(res.statusCode).toBe(201);
expect(res.body).toHaveProperty("userId");
```
2. url.test.js
✅ Features Covered
Feature	Description
Create Short URL	Authenticated user can shorten a URL
Analytics	Retrieves totalClicks for the short URL
Redirect simulation	Simulates hitting the short link to increase click count

🧪 Sample Assertions
```js

expect(res.statusCode).toBe(200);
expect(res.body).toHaveProperty("id");

expect(res2.body.totalClicks).toBe(1);
```

🧩 Test Environment: setup.js
Uses mongodb-memory-server to provide an isolated test DB:

```js

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});
```

🧾 Summary of Test Coverage

|Layer		|Component / Module	Coverage  |
|-----------|-----------------------------|
|Frontend	|Dashboard Component	      |
|Frontend	|Login Component		      |
|Frontend	|API Requests + MSW Mocking	  |
|Backend	|Auth Routes (/signup, /login)|
|Backend	|URL Routes (/url, /analytics)|
