# Project Setup Guide

This guide explains how to set up the dependencies, environment variables, and build the Horus resune analyzer on your local machine.

---

## Prerequisites

Ensure you have the following installed on your machine:

- **Docker** 
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

## Step 3: Make horus-ai-resume-project/frontend/.env and fill in the following environment variables
```env
JWT_SECRET=yourJWTSecret
```
## Step 4: Run docker compose

## Navigate to the `horus-ai-resume-project` directory of the project, then run the following script to build and run the application:
```bash
docker-compose up --build
```

## Step 6: Use app
Open your browser and navigate to `http://localhost:3000` to view the application.
