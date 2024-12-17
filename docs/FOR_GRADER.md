### Discrepencies
1. We pushed a fix for routing issues. It should be resolved now but if in case you try login in or registering and (nothing happens/page crashes), just refresh the page.
2. The fit score logic is in the get feedback api, so we didn't feel the need to make an endpoint for fit-score.
3. The missing keyword logic is handled by Gemini in the prompt when we ask it to generate feedback.
4. For the Download PDF Report, since the page is already client sided, it makes no sense to make an API for this. It's handled in the frontend itself.
5. Instead of passing the resume and job description text to the apis, we instead pass the id stored in the database and extract the text from that instead.
### Extra Credit
1. We used a database instead of storing locally in a dictionary.
2. We allow the user to upload docx's for the resume, which is extra credit.
3. We implemented Docker, which is extra credit. (Make sure you have your docker daemon running. This can be done multiple ways, easiest being downloading and opening Docker Desktop.)
4. We added a bunch of API's that weren't asked for like listing out the jd's and resumes, editing the names of the jd's and resumes, as well as deleting them.
### Environment Variables & Setup
1. The backend/.env and frontend/.env will be sent in the code-green-team discord channel in Mccann's server.
2. The project is built in Typescript, so do "npm i" -> "npm run build" -> "npm run dev" for both backend and frontend.
### Unit Tests
1. In order to run unit tests, simply run "npm run test" after you've ran "npm i" and then "npm run build" in the backend/frontend directory
### End 2 End Tests
1. In horus-ai-resume-project, run npm i -> npm run start. Make sure you have Docker Setup open.
2. Open a new terminal and run npm run e2etest
3. Select E2E Testing
4. Scroll all the way down to find app.cy.js and select it.