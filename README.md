# Project Management Tool

This is a MERN stack project management application developed as part of my **CodSoft Internship**. It allows users to efficiently manage projects by creating tasks, assigning deadlines, and tracking progress in a collaborative environment.

## Features

- User registration and login  
- Create and manage multiple projects  
- Assign tasks to specific projects  
- Set task deadlines  
- Track task and project completion status  
- Responsive and intuitive user interface

## Tech Stack

- **Frontend:** React  
- **Backend:** Node.js, Express  
- **Database:** MongoDB

## Folder Structure

project-management-tool/
├── client/ # React frontend
│ ├── public/
│ └── src/
│ ├── components/
│ ├── pages/
│ ├── App.js
│ └── index.js
├── server/ # Node.js backend
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── index.js
│ └── .env # MongoDB connection string goes here
├── package.json
└── README.md



## How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/syed-shoab/projectManageTool.git
   cd projectManageTool
2. **Set up the backend:**
   ```bash
   cd server
   npm install

3. **Set up environment variables:**

   Create a `.env` file inside the `server` folder and add:
   ```env
   MONGO_URI=your_mongodb_connection_string

3. **Start the Backed Server:**
   node index.js   # or use nodemon if installed
   
5. **Set up the frontend:**
    cd ../client
    npm install
    npm start

   Visit the app at http://localhost:3000

## Deployment Options

**Frontend:** Vercel, Netlify  
**Backend:** Render, Railway, or any Node.js-compatible hosting platform

## Author

**Syed Shoab**  
📧 syedshoab1100@gmail.com








