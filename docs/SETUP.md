# Project Setup Guide

This guide explains how to set up the dependencies, environment variables, and build the Osiris API project on your local machine.

---

## Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (v14 or later)
- **npm** (comes with Node.js)
- **Docker** (for containerized development, if applicable)
---

## Step 1: Pull the repository
```bash
git clone https://github.com/aryansrana/horus-ai-resume-project.git
```

## Step 2: Install Project Dependencies

Navigate to the `core` directory of the project, then run the following command to install all dependencies:

```bash
cd backend
npm install
```

## Step 2: Make horus-ai-resume-project/backend/.env and fill in the following environment variables
```env
MONGO_USERNAME=yourMongoUsername
MONGO_PASSWORD=yourMongoPassword
MONGO_DATABASE=yourDatabaseName
PORT=yourPortNumber
JWT_SECRET=
JWT_EXPIRATION=
```
Talk to Aryan asap for credentials, discord user is sucko

## Step 3: Transpile the Typescript Code into Javascript Code

Navigate to the `backend` directory of the project, then run the following script to build dist/ with the javascript files:
```bash
npm run build
```

## Step 4: Start backend
```bash
npm run start
```

## Additional Notes:
Check package.json for other scripts

## Step 5: Start frontend 

Move into the frontend directory, instructions below assuming you're in backend
```bash
cd ../frontend
npm run build
npm run start
```
## Step 6: Use app
Open your browser and navigate to `http://localhost:3000` to view the application.

### Docker not yet implemented