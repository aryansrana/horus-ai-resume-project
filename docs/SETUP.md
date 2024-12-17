# Project Setup Guide

This guide explains how to set up the dependencies, environment variables, and build the Horus resume analyzer project on your local machine without using docker. If you would like to use docker look at DOCKER_SETUP.md

---

## Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (v14 or later)
- **npm** (comes with Node.js)
---

## Step 1: Pull the repository
```bash
git clone https://github.com/aryansrana/horus-ai-resume-project.git
```

## Step 2: Make horus-ai-resume-project/backend/.env and fill in the following environment variables
```env
MONGO_USERNAME=yourMongoUsername
MONGO_PASSWORD=yourMongoPassword
MONGO_DATABASE=yourDatabaseName
PORT=yourPortNumber
JWT_SECRET=
JWT_EXPIRATION=
HUGGINGFACE_API_KEY=yourAPIKey
GEMINI_API_KEY=yourAPIKey
```
Talk to Aryan asap for credentials, discord user is sucko

## Step 3: Start backend
Move into the backend directory and run the following commands
```bash
npm i
npm run build
npm run start
```

## Additional Notes:
Check package.json for other scripts


## Step 4: Make horus-ai-resume-project/frontend/.env and fill in the following environment variables
```env
JWT_SECRET=yourJWTSecret
```

## Step 5: Start frontend 
Move into the frontend directory and run the following commands
```bash
npm i
npm run build
npm run start
```
## Step 6: Use app
Open your browser and navigate to `http://localhost:3000` to view the application. When the site is running, if you have an issue with the login or register buttons please refresh the page, this is due to an issue with the nextjs router.

### Unit Tests
1. In order to run unit tests, simply run "npm run test" after you've ran "npm i" and then "npm run build" in the backend/frontend directory

### End 2 End Tests
1. In horus-ai-resume-project, run npm i -> npm run start. Make sure you have Docker Setup open.
2. Open a new terminal and run npm run e2etest
3. Select E2E Testing
4. Scroll all the way down to find app.cy.js and select it.
