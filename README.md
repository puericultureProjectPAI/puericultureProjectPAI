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

### Back-end (Spring Boot) & Supabase Auth
We are using Supabase to handle Authentication. **Spring Boot needs the exact same JWT Secret as Supabase** to validate user tokens.

**1. Set up your `.env` in `project/back`:**
Copy `.env.example` to `.env`.

**2. Fetch your local JWT Secret:**
- Start Supabase locally: `npx supabase start -x edge-runtime`
- Run `npx supabase status`
- Copy the `JWT secret` value from the console output.
- Paste it into your `.env` file under `JWT_SECRET_KEY=...`

*(Note: If you run `npx supabase stop --no-backup` and restart, this local secret will change. You must update your `.env` file).*

### Front-end (Vite)
Create an `.env.local` file in `project/front` to connect to your local backend:
```env
  VITE_API_URL=http://localhost:8080
```

**Mandatory rule for API calls**: Always use import.meta.env.VITE_API_URL to construct your fetch requests. This ensures seamless transition between local development and production.

## 4. Local Execution & Deployment
### Run Back-end (Local Dev):
**Development Mode (Watch/Debug):**
```bash
  cd project/back
  mvn spring-boot:run
```

### Run Front-end (Local Dev):
```bash
  cd project/front
  npm run dev
```

### Deployment Infrastructure:

- Backend: Automatically built via GitHub Actions and deployed to Koyeb as a Docker container.

- Frontend: Automatically built and deployed by Vercel upon pushing to the main branch. No Docker required for the frontend.

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