import 'cypress-file-upload'; // Ensure this is imported

describe('Resume and Job Description Upload', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login') // Adjust to your login page URL
  })

  it('logs in, uploads resume, fills job description, adds it, selects, and analyzes', () => {
    // Step 1: Log in with test credentials
    cy.get('input[name="email"]').type('test@gmail.com')
    cy.get('input[name="password"]').type('12345')
    cy.get('button[type="submit"]').click()

    // Assuming successful login redirects to the dashboard page
    cy.url().should('include', '/dashboard')

    // Step 2: Click the "Upload New Resume" button to trigger resume upload UI
    cy.contains('Upload New Resume').click()

    // Step 3: Upload the resume file from cypress/fixtures
    const resumeFile = 'sample.docx' // The resume file you want to upload from fixtures
    cy.get('input[type="file"]').attachFile(resumeFile) // Upload the resume file
    
    // Step 4: Click the "Upload New Job Description" button to trigger job description UI
    cy.contains('Add New Job Description').click()

    // Step 5: Fill in the job description (title and description)
    cy.get('input[placeholder="Job Description Name"]').type('This is the title') // Job description title
    cy.get('textarea[placeholder="Job Description"]').type('This is the description about AI and Machine Learning and Coding') // Job description description
    
    // Step 6: Click the "Add" button (using class for targeting)
    cy.get('button')
  .each(($btn) => {
    // Use .invoke to get the text of the button
    cy.wrap($btn)
      .invoke('text')
      .then((buttonText) => {
        if (buttonText.trim() === 'Add') {
          cy.wrap($btn).click({ force: true }); // Click the matching button
        }
      });
  });

    
  cy.get('tr') // Targeting the row
  .contains('sample.docx') // Look for the specific row containing the name "hi"
  .parent().parent().parent() // Get the parent tr element
  .find('button') // Find all buttons within that row
  .contains('Select') // Find the "Select" button specifically
  .click();

// Step 8: Click the second "Select" button for the job description
cy.get('tr') // Same logic for the job description
  .contains('This is the title') // Look for the specific job description
  .parent().parent().parent() // Get the parent tr element
  .find('button') // Find all buttons within that row
  .contains('Select') // Find the "Select" button specifically
  .click();
    cy.intercept('POST', 'http:/localhost:8080/api/analyze').as('analyze')
    // Step 9: Analyze the uploaded files and entered job description
    cy.contains('Analyze').click()
    cy.wait('@analyze').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });
    // Step 10: Verify that analysis results are displayed
    cy.contains('Fit Score').should('be.visible')
    cy.contains('Keyword Matches').should('be.visible')
    cy.contains('Suggestions').should('be.visible')

    // Step 11: Download the results as a PDF
    cy.contains('Download Results').click()
  })
})
