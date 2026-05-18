# Puericulture Project PAI

> **CRITICAL SETUP:** Do not bypass the root initialization. Husky pre-commit hooks are mandatory. Your code will be rejected automatically if quality standards are not met.

## 1. Global Setup (Run Once)
At the absolute root of the repository (`puericultureProjectPAI`), install the global Git hooks:
```bash
  npm install
```

## 2. Dependencies Setup
You must install dependencies for both sides of the monorepo.

**Front-end:**
```bash
  cd project/front
  npm install
```

**Back-end:**
```bash
  cd project/back
  npm install
```

## 3. Environment & Database
**Architectural Paradigm:** 
Identity and Authentication are completely delegated to Supabase Auth.
The Frontend logs the user in directly via the Supabase SDK and receives a JWT.
This JWT is then attached to every request sent to the Spring Boot Backend.
The Backend acts as a stateless API. It automatically fetches the public key via the Supabase JWKS endpoint to verify the token's cryptographic signature (ES256) before granting access.

**Retrieving Local Supabase Variables**
To extract the required local credentials, run the following command while the local Supabase instance is running:
```bash
npx supabase status --output env
```

### Back-end (Spring Boot) & Supabase Auth
Set up your .env in project/back:
1. Copy `.env.example` to `.env`.
2. **Note on JWTs:** Hardcoding the `SUPABASE_JWT_SECRET` is completely obsolete. The backend's `JwtService` automatically retrieves the correct public key from the Supabase JWKS endpoint.
3. Complete any remaining variables (such as database credentials or `SUPABASE_SERVICE_KEY`) using the output provided by the `npx supabase status` command.

### Front-end (Vite)
Set up your `.env.local` in project/front:
Copy `.env.local.example` to `.env.local` to connect to your local backend and Supabase instance.

**Mandatory rule for API calls**: Always use import.meta.env.VITE_API_URL to construct your fetch requests. This ensures seamless transition between local development and production.

## 4. Local Execution & Deployment

### Start Supabase (Database & Auth Engine):
```bash
  cd project/back
  npx supabase start -x edge-runtime,storage-api
```

### Run Back-end (Local Dev):
**Development Mode (Watch/Debug):**
```bash
  cd project/back
  mvn spring-boot:run
```

### Run Front-end (Local Dev):
> **ARCHITECTURAL REQUIREMENT:** A local mock server is mandatory to intercept image uploads and prevent Cloudinary quota exhaustion or secret exposure in development.

**Terminal 1 (Image Mock Server):**
```bash
  cd project/front
  node mock-server.js
```

**Terminal 2 (Vite Application):**
```bash
  cd project/front
  npm run dev
```
### Deployment Infrastructure:

- Backend: Automatically built via GitHub Actions and deployed to Render as a Docker container.

- Frontend: Automatically built and deployed by Vercel upon pushing to the main branch. No Docker required for the frontend.

**Note : Remember to clean the folder `/public/mock-uploads` to prevent it from being overfilled.**

## 5. Database Migrations Workflow
> Modifications require Tech Lead / CTO validation before merging.

1. **Create Migration:** Run `npx supabase migration new your_feature_name`
2. **Implementation:** Write PostgreSQL DDL in the generated file under `supabase/migrations/`.
3. **Local Test:** Run `npx supabase db reset` to apply changes and verify `supabase/seed.sql` integrity.
4. **Merge:** Open a Pull Request for review.

## 6. Quality Control & Auto-formatting
A pre-commit hook (Husky) is strictly enforced at the root of the repository.
When you attempt to commit, the pipeline will **automatically**:
1. Format your frontend code (Prettier) and fix simple linting errors (ESLint).
2. Format your backend code (Spotless/Google Java Format).
3. Run a syntax compilation check on the Java backend.

If a logical error prevents formatting or compilation, the commit will be rejected.

**Manual Commands:**
If you want to run these tools manually before committing:
- **Frontend:** run `npm run format` and `npm run lint:fix` in `project/front`.
- **Backend:** run `mvn spotless:apply` in `project/back`.

## 7. API Documentation & Contract (Swagger / OpenAPI)
> **CRITICAL STANDARD:** Every new endpoint must be fully documented using OpenAPI annotations.
> If the Swagger UI is missing your endpoint, lacks descriptions, or hides DTO schemas, your Pull Request will be rejected.

Spring Doc OpenAPI automatically generates our API contract. This is our single source of truth.
It allows Frontend developers to mock data, understand backend responses, and work synchronously without having to read a single line of Java code.

**Local Endpoints (Backend must be running):**
- **Swagger UI (Visual Interface & Testing):** [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **OpenAPI Schema (Raw JSON):** [http://localhost:8080/api-docs](http://localhost:8080/api-docs)

**Reference Implementation:**
Before writing your first endpoint, you must understand our standard. Strictly follow the structure, Javadoc intent, and annotation rules demonstrated in these two reference files:
1. **Controller:** [`project/back/src/main/java/com/puericulture/common/controller/HealthCheckController.java`](project/back/src/main/java/com/puericulture/common/controller/HealthCheckController.java)
2. **DTO:** [`project/back/src/main/java/com/puericulture/common/dto/HealthCheckResponse.java`](project/back/src/main/java/com/puericulture/common/dto/HealthCheckResponse.java)
