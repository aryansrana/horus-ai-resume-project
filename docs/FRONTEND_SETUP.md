# Resume Analyzer - Setup Instructions

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Installation Steps

1. Enter the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Install shadcn/ui components:
   ```
   npx shadcn@latest init
   ```
   Follow the prompts to set up shadcn/ui. Choose TypeScript, tailwind.css, and default options for the rest.

4. Install additional required packages:
   ```
   npm install axios react-router-dom @hookform/resolvers zod
   ```

5. Start the development server:
   ```
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000` to view the application.

## Project Structure

The frontend code is organized as follows:

```
app/
├── components/
│   ├── SignUp.tsx
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── ResumeUpload.tsx
│   └── JobDescription.tsx
├── App.tsx
└── main.tsx
```

Each component corresponds to a specific page or functionality in the application.