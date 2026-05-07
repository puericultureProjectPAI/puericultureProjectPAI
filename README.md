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
Create your `.env` file in `project/back` with your local Supabase credentials.

**Start Supabase (University network):**
```bash
npx supabase start -x edge-runtime
```

**Start Supabase (Home network):**
```bash
npx supabase start
```

## 4. Docker Deployment
**Development Mode (Watch/Debug):**
```bash
docker build --target dev -t puericulture:dev .
docker run -p 8080:8080 puericulture:dev
```

**Production Mode (Slim/JRE only):**
```bash
docker build --target prod -t puericulture:prod .
docker run -p 8080:8080 puericulture:prod
```

## 5. Database Migrations Workflow
> Modifications require Tech Lead / CTO validation before merging.

1. **Create Migration:** Run `npx supabase migration new your_feature_name`
2. **Implementation:** Write PostgreSQL DDL in the generated file under `supabase/migrations/`.
3. **Local Test:** Run `npx supabase db reset` to apply changes and verify `supabase/seed.sql` integrity.
4. **Merge:** Open a Pull Request for review.

## 6. Quality Control (Husky)
A pre-commit hook automatically runs formatting checks and backend compilation. To manually fix frontend issues before attempting a commit, run these commands in `project/front`:
- Format code: `npm run format`
- Auto-fix linting: `npm run lint:fix`