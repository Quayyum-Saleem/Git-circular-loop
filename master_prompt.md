<USER_REQUEST>
# MASTER PROJECT PROMPT — CIRCULARLOOP

## 1. YOUR ROLE

Act as a senior full-stack engineer, UI/UX designer, AI engineer, database architect, and sustainability product designer.

Build a complete, polished, responsive, hackathon-ready web application named **CircularLoop**.

Do not just explain how to build it. Inspect the current workspace, create and edit the required files, install compatible dependencies, implement the frontend and backend, connect them, run the application, test the important features, and fix errors you discover.

If a project already exists, inspect it and preserve useful work rather than unnecessarily replacing it. If something cannot be completed because a dependency, credential, or external service is unavailable, implement the best practical fallback and explain the limitation.

## 2. PROJECT VISION

CircularLoop is an AI-assisted circular-economy platform that helps people extend the useful life of products through reuse, repair, donation, and responsible recycling.

The problem is that many usable products are discarded because people cannot easily find someone who needs them, a repair option, or an appropriate recycling destination.

Our solution connects item owners with potential recipients and repair or recycling options, while tracking the environmental outcomes of completed activities.

Target users:
- College students and educational institutions.
- Individuals with unused products.
- People looking for affordable reusable items.
- Repair shops and community repair groups.
- Charities, donation centres, and recycling organisations.
- Sustainability coordinators and campus administrators.

Primary demonstration scenario:
A student lists an unused laptop, another student finds it through smart matching, the owner accepts the request, the exchange is completed, and the environmental impact dashboard updates.

The application must be usable even when AI APIs and external map services are unavailable.

## 3. REQUIRED TECHNOLOGY STACK

Frontend:
- React with Vite.
- TypeScript.
- Tailwind CSS.
- React Router.
- Lucide React icons.
- Recharts for data visualisation.
- React Hook Form and Zod for forms and validation where appropriate.

Backend:
- Python.
- FastAPI.
- Pydantic.
- SQLAlchemy ORM.
- SQLite as the default development database.
- Alembic migrations if practical.
- Uvicorn for the development server.

Integration:
- REST API between React and FastAPI.
- Fetch or Axios for HTTP requests.
- Multipart uploads for item photos.
- Environment variables for configurable settings.
- Leaflet with OpenStreetMap for optional location visualisation.

AI:
- Implement a modular image-classification service.
- If a suitable pretrained model is available, use it to suggest an item's category.
- If a model or API key is unavailable, provide a working manual category selector and a clearly labelled demo suggestion mode.
- Never pretend that an AI model has analysed an image if it has not.
- Do not require paid API credentials for the basic application to run.

## 4. VISUAL IDENTITY AND UI/UX DESIGN

Create a premium, modern sustainability startup aesthetic. Avoid a generic admin template or a simple CRUD dashboard.

Brand name: CircularLoop

Suggested tagline:
"Give Every Product Another Life."

Design direction:
- Warm off-white background: #F8F8F2.
- Deep forest green: #174B38.
- Leaf green: #4F8A5B.
- Soft sage: #DDEBDD.
- Charcoal text: #202821.
- Warm muted orange for selected highlights.
- Rounded cards, subtle borders, restrained shadows, generous whitespace, and clear typography.

Use a readable font such as Inter or Manrope.

Design requirements:
- Fully responsive for desktop, tablet, and mobile.
- Consistent spacing and typography.
- A polished sidebar or responsive navigation system.
- Clear primary and secondary buttons.
- Attractive empty states and loading skeletons.
- Accessible colour contrast and keyboard-friendly controls.
- Visible form validation and helpful error messages.
- Toast notifications for successful actions and failures.
- Confirmation dialogs for destructive actions.
- Consistent icons from Lucide React.
- Real item photography and well-designed illustrations where useful.

IMAGE REQUIREMENTS:
- Use high-quality, relevant product photography for laptops, books, furniture, clothing, appliances, and repair activities.
- Use stable, legitimate image URLs or locally stored assets with suitable usage rights.
- Prefer local assets when practical so the demo remains reliable.
- Provide a default image or attractive placeholder whenever an image is missing.
- Preserve image aspect ratios and use object-fit: cover for product cards.
- Add descriptive alt text to every meaningful image.
- Allow users to upload their own item photographs and preview them before submission.
- Do not use broken image URLs, random unrelated images, or image URLs that change unpredictably.
- Do not embed text inside images to create UI elements.
- Use CSS and HTML for interface text, buttons, badges, and labels.

## 5. APPLICATION PAGES

Build the following pages and make the navigation work.

### Page A: Landing page

Create an impressive public landing page with:
- CircularLoop logo and navigation.
- Hero headline: "Your Unused Things Deserve Another Life."
- Supporting text explaining reuse, repair, donation, and recycling.
- Primary CTA: "Explore Items".
- Secondary CTA: "List an Item".
- A large, attractive hero photograph illustrating sustainable reuse.
- Featured items with photographs, categories, conditions, and locations.
- A simple three-step explanation: List, Match, Give Again.
- A sustainability impact section.
- A section for campus and community participation.
- Testimonials or illustrative user stories clearly marked as sample content.
- A strong final CTA and a useful footer.

Make the landing page visually impressive without overwhelming users with excessive text.

### Page B: Authentication

Implement a practical authentication flow:
- Registration with name, email, and password.
- Login and logout.
- Password hashing on the backend.
- Validation and helpful error messages.
- Protected routes for user-specific actions.
- A secure development configuration using environment variables.

Do not store plain-text passwords.

If demo mode is enabled, clearly separate the demo account from production authentication. Never create an unauthenticated endpoint that exposes private user information.

### Page C: User dashboard

Show:
- Welcome message.
- Active listings.
- Pending requests.
- Completed exchanges.
- Saved items.
- CircularLoop points.
- A small environmental impact summary.
- Recent activity.
- Quick actions for listing an item and browsing items.

All statistics should come from the backend or be clearly labelled as sample demonstration data.

### Page D: Browse marketplace

Create a visually rich marketplace with:
- Search by item name and description.
- Category filters.
- Condition filters.
- Purpose filters: reuse, donation, repair, and recycling.
- Location filters where supported.
- Sorting by newest, relevance, and distance when coordinates are available.
- Responsive product cards with photographs.
- Item condition, category, owner information, and location.
- Save-to-favourites functionality.
- Pagination or a load-more interaction.

Create a polished item detail page with:
- Large image gallery.
- Item title and description.
- Category and condition.
- Listing purpose and price, if applicable.
- Approximate location rather than exposing a user's exact private address.
- Owner's public profile information.
- Request Item button.
- Contact or exchange request workflow.
- Similar recommended listings.

### Page E: Create and edit item listings

Create a complete form with:
- Item title.
- Description.
- Category.
- Item condition.
- Listing purpose.
- Optional price for listings that are offered for sale.
- Image upload with preview.
- General location.
- Optional latitude and longitude.
- Pickup or exchange preferences.
- Submit, save, and cancel actions.

Categories:
- Electronics.
- Books and educational materials.
- Furniture.
- Clothing and accessories.
- Home appliances.
- Household items.
- Sports and recreation.
- Other.

Listing purposes:
- Give away.
- Sell for reuse.
- Request repair.
- Donate.
- Responsible recycling.

Implement both frontend and backend validation. Restrict file types and file sizes. Generate safe filenames and prevent path traversal. Store uploaded images in a configurable local media directory for development.

Do not allow a user to edit or delete another user's listings.

### Page F: Smart matching engine

Implement actual matching logic rather than displaying arbitrary recommendations.

Rank possible matches using:
- Category compatibility.
- Listing purpose.
- Item condition and intended use.
- User preferences where available.
- Location proximity when valid coordinates are available.
- Listing availability and exchange status.

Return a match score and a human-readable explanation, such as:
"Strong match: same category, suitable condition, and within the selected search radius."

Use a transparent, rule-based matching algorithm first. AI can be added later.

Show:
- Recommended items.
- Why each item was recommended.
- Match score.
- Request or view-details action.
- Filters for category and location.

Do not claim that the match score is a scientifically validated probability.

### Page G: Repair-first assistant

Create a dedicated feature to encourage repair before disposal.

Allow users to:
- Select or describe a damaged item.
- Select a problem type.
- View a basic troubleshooting checklist.
- Compare repair, reuse, donation, and recycling as possible next steps.
- Find local repair providers when location data is available.
- Submit a repair request or save the item for later.

Use safe, general guidance. For dangerous electrical faults or other high-risk repairs, recommend a qualified professional.

Do not fabricate real repair shops. If none are available from a verified source, show a clear search option or demonstration entries labelled as sample data.

### Page H: Map and nearby opportunities

Use Leaflet and OpenStreetMap if the integration is available.

Show:
- Approximate item locations.
- Repair and donation destinations when reliable location data exists.
- A list of nearby opportunities.
- A search radius or location filter.
- A fallback list view if the map cannot load.

Request location permission only after the user chooses to use location-based features.

Do not expose exact home addresses or precise user locations publicly. Avoid inventing geographic coordinates.

The core marketplace must still work if mapping services are unavailable.

### Page I: Environmental impact dashboard

Build an attractive analytics page showing:
- Number of completed reuse exchanges.
- Number of repaired items.
- Number of donations.
- Number of recycling handoffs.
- Items successfully diverted from disposal.
- User participation and activity trends.
- Category-wise reuse statistics.
- Monthly activity charts.

Separate directly recorded counts from estimated environmental metrics.

For estimated waste diverted, use a documented method based on item weight when known, or transparent category-based assumptions where appropriate.

For estimated carbon emissions avoided:
- Use a documented calculation method and credible emission factors if available.
- Show the formula, assumptions, and source of emission factors.
- Do not claim verified carbon savings based only on a completed listing.
- If reliable data is unavailable, display the metric as unavailable or clearly marked as a demonstration estimate.

Include an "Impact methodology" section explaining how estimates are calculated.

### Page J: Rewards and community

Create a simple gamification system:
- Award points for qualifying completed reuse, repair, and donation activities.
- Maintain an activity history.
- Show achievements and badges.
- Display a community leaderboard using opt-in public display names.
- Prevent duplicate point awards for the same completed transaction.

Do not award points simply for creating fake or incomplete listings.

Example badges:
- First Item Reused.
- Repair Champion.
- Community Helper.
- Circular Campus Contributor.

### Page K: User profile and settings

Include:
- Profile name and optional avatar.
- General location.
- User's listings.
- Exchange history.
- Saved items.
- Privacy settings.
- Notification preferences.
- Account logout.

Protect personal data and ensure that users can access only their own private information.

## 6. CORE BUSINESS WORKFLOW

Implement the following end-to-end flow:

1. A user registers or enters an explicitly labelled demo mode.
2. The user creates an item listing with a photo.
3. The backend saves the listing in SQLite.
4. Another user browses or searches for the item.
5. The matching engine recommends it when relevant.
6. The second user submits an exchange request.
7. The owner accepts or rejects the request.
8. Both users can view the current request status.
9. When the exchange is confirmed as completed, update the listing status and record the transaction.
10. Update the dashboard, impact counters, activity history, and reward points.
11. Prevent duplicate completion records and duplicate reward awards.

Use clear status values, such as:
Available, Requested, Accepted, Completed, Cancelled.

Design the backend so that concurrent requests cannot easily cause the same listing to be exchanged twice.

## 7. DATABASE DESIGN

Use SQLAlchemy models and suitable relationships.

Create models for:
- User.
- ItemListing.
- ListingImage, if multiple images are supported.
- Favourite.
- ExchangeRequest.
- CompletedExchange or equivalent transaction record.
- ImpactRecord.
- RewardTransaction.
- RepairProvider or RepairRequest if implemented.

Include:
- Primary and foreign keys.
- Created and updated timestamps.
- Listing status.
- Owner ID.
- Appropriate database indexes.
- Validation constraints where practical.

Use database migrations or a reliable development initialization process.

Provide a seed script with realistic sample users, item listings, categories, and completed exchanges.

Clearly distinguish seed data from real user activity.

## 8. BACKEND API

Create documented REST endpoints for:
- Authentication.
- User profiles.
- Item listing CRUD.
- Item search and filters.
- Image upload.
- Favourites.
- Exchange requests.
- Accepting and rejecting requests.
- Completing exchanges.
- Smart recommendations.
- Repair suggestions and requests.
- Impact analytics.
- Reward history.
- Nearby items when geographic data is available.

Use consistent HTTP status codes, structured JSON responses, input validation, and useful error messages.

Add appropriate CORS settings for the development frontend.

Use FastAPI's automatically generated Swagger documentation at /docs.

Protect private endpoints with authentication and enforce resource ownership.

Do not put secrets, API keys, or passwords in frontend source code or commit them to the repository.

## 9. FRONTEND-BACKEND INTEGRATION

Create a single configurable API base URL through an environment variable.

Provide an .env.example file.

Implement:
- A reusable API client.
- Typed API response models.
- Loading states.
- Empty states.
- Error handling.
- Authentication state management.
- Protected routes.
- Form validation.
- Image preview and upload.
- Toast feedback.
- Refreshing relevant UI data after successful mutations.

All important buttons must perform real actions.

Do not leave fake buttons, dead links, or nonfunctional forms in the final demo.

If a feature is not implemented, disable it or clearly label it as a planned feature.

## 10. OPTIONAL AI IMAGE CLASSIFICATION

Create an isolated AI service interface that can later connect to a suitable pretrained model or image-classification API.

The intended flow is:
1. The user uploads an item photo.
2. The image is validated.
3. The classifier suggests a category.
4. The user reviews and confirms the category.
5. The listing is saved.

The model should support the project's item categories as far as its capabilities allow.

Do not train a large model from scratch for the hackathon.

If no suitable model is available, use a clear manual classification flow and optionally a demo-only suggestion mode.

Never expose API keys in browser code. Do not make paid services mandatory.

## 11. SECURITY AND PRIVACY

Implement reasonable security for a hackathon prototype:
- Password hashing.
- Authentication and authorization.
- Environment-based secrets.
- Request validation.
- Upload size and file-type restrictions.
- Safe upload filenames.
- Resource ownership checks.
- Rate limiting on sensitive endpoints where practical.
- Privacy-conscious location display.
- Generic authentication errors where appropriate.
- Safe handling of user-generated text.
- No hardcoded production credentials.
- No unnecessary collection of personal information.

Add a README section describing remaining production-security requirements.

## 12. ACCESSIBILITY AND QUALITY

Ensure:
- Semantic HTML.
- Keyboard-accessible controls.
- Visible focus indicators.
- Form labels and validation messages.
- Meaningful image alt text.
- Responsive navigation.
- Readable text and sufficient contrast.
- Consistent empty, loading, success, and failure states.

Avoid excessive animations, oversized gradients, cluttered layouts, and distracting effects.

Use subtle transitions and clear visual hierarchy.

## 13. TESTING

Create automated tests for important backend behaviour, including:
- Registration and login.
- Creating and retrieving listings.
- Listing validation.
- Access control.
- Searching and filtering.
- Exchange request creation.
- Accepting and rejecting requests.
- Completing an exchange.
- Preventing duplicate completion and reward awards.
- Updating impact counters.

Add frontend tests for critical user interactions if practical.

Run the available test suites and fix errors before reporting completion.

## 14. PROJECT STRUCTURE

Use a clean, maintainable structure similar to:

circularloop/
  frontend/
    src/
      components/
      pages/
      layouts/
      hooks/
      services/
      types/
      utils/
      assets/
    public/
    package.json
    .env.example
  backend/
    app/
      api/
      core/
      models/
      schemas/
      services/
      db/
      main.py
    tests/
    uploads/
    requirements.txt
    .env.example
  README.md
  .gitignore

You may adjust this structure if needed, but keep frontend, backend, configuration, and tests clearly organized.

Do not create unnecessary duplicate folders or placeholder files that are never used.

## 15. RUNNING THE APPLICATION

Write a complete README that explains:
- Required software.
- How to create the Python virtual environment.
- How to install backend dependencies.
- How to configure environment variables.
- How to initialise the database and load demo data.
- How to start FastAPI with Uvicorn.
- How to install frontend dependencies.
- How to start React with Vite.
- Frontend and backend URLs.
- Swagger API documentation URL.
- How to run tests.
- Known limitations and optional AI/map configuration.

Support Windows PowerShell instructions as well as standard commands where practical.

## 16. HACKATHON DEMONSTRATION MODE

Seed the database with clearly labelled demonstration data:
- An unused laptop.
- A collection of educational books.
- A repairable office chair.
- Reusable household items.
- A donation listing.
- Several sample completed exchanges.

Create enough coherent data to make search, filtering, recommendations, and analytics demonstrable.

Provide a simple reset or reseed procedure for restoring the demo environment.

Never present sample transactions or simulated environmental impact as real-world verified results.

## 17. IMPLEMENTATION PRIORITIES

Build in this order:

Priority 1:
- Project setup.
- Database and models.
- Backend APIs.
- React application shell.
- Landing page and marketplace.
- Listing creation and photo upload.

Priority 2:
- Authentication.
- Exchange request workflow.
- Smart matching.
- Dashboard and impact analytics.

Priority 3:
- Repair-first assistant.
- Map integration.
- Rewards.
- Optional AI image classification.

Prioritize a fully working end-to-end core workflow over a large collection of unfinished features.

## 18. ACCEPTANCE CRITERIA

The project is ready for demonstration when:
1. Frontend and backend start successfully.
2. The frontend communicates with FastAPI.
3. Database records persist across restarts.
4. A user can create and browse listings.
5. Uploaded photos display correctly.
6. Search and filters work.
7. Exchange requests can be accepted or rejected.
8. A completed exchange updates the relevant records.
9. Dashboard statistics update from backend data.
10. Access control prevents unauthorised modifications.
11. Responsive pages work on desktop and mobile.
12. Seed data makes the demo easy to reproduce.
13. Critical automated tests pass.
14. README setup instructions are accurate.
15. Unavailable integrations fail gracefully.

## 19. FINAL INSTRUCTIONS

Start by inspecting the existing workspace and checking the available runtime and dependencies.

Then implement the application in manageable stages. Do not stop after writing a plan. Run the code, inspect errors, test the main user journey, and correct issues where possible.

Do not claim that a feature works unless it has been implemented and verified.

At the end, report:
- What was implemented.
- Important files created or changed.
- Exact commands to start the frontend and backend.
- Test results.
- Any remaining limitations.
- The next three highest-priority improvements.

The final result should look polished enough for a sustainability hackathon presentation and be functional enough to demonstrate a complete circular-economy transaction.

**Product principle: Every item should have a clear next step—reuse, repair, donate, or recycle.**
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-10-22T19:31:10+05:30.
</ADDITIONAL_METADATA>
<USER_SETTINGS_CHANGE>
The user changed setting `Model Selection` from None to Gemini 3.8 Flash (High). No need to comment on this change if the user doesn't ask about it. If reporting what model you are, please use a human readable name instead of the exact string.
</USER_SETTINGS_CHANGE>