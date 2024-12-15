### Discrepencies
1. We jerry rigged a fix for routing issues. It should be resolved now but if you try login in or registering and (nothing happens/page crashes), just refresh the page.
2. The fit score logic is in the get feedback api, so we didn't feel the need to make an endpoint for fit-score.
3. The missing keyword logic is handled by Gemini in the prompt when we ask it to generate feedback.
4. For the Download PDF Report, since the page is already client sided, it makes no sense to make an API for this. It's handled in the frontend itself.
### Extra Credit
1. We used a database instead of storing locally in a dictionary.
2. We allow the user to upload docx's for the resume, which is extra credit.
3. We implemented Docker, which is extra credit. (Make sure you have your docker daemon running. This can be done multiple ways, easiest being downloading and opening Docker Desktop.)
4. We added a bunch of API's that weren't asked for like listing out the jd's and resumes, editing the names of the jd's and resumes, as well as deleting them.
### Environment Variables & Setup
1. The backend/.env and frontend/.env will be sent in the code-green-team discord channel in Mccann's server.
2. The project is built in Typescript, so do npm i -> npm run build -> npm run dev for both backend and frontend.