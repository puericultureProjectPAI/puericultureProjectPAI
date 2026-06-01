# Puericulture Project PAI

> **CRITICAL SETUP:** Do not bypass the root initialization. Husky pre-commit hooks are mandatory. Your code will be rejected automatically if quality standards are not met.

---

## 1. Installation (Dependencies)

```bash
# Root (Git Hooks)
npm install

# Front-end
cd project/front
npm install

# Back-end
cd ../back
npm install
```

---

## 2. Infrastructure & Environment Setup

### A. Start Supabase (Database & Auth Engine)

```bash
cd project/back
npx supabase start -x edge-runtime,storage-api
```

### B. Retrieve Local Credentials

Once the container is running:

```bash
npx supabase status
```

### C. Configure Environment Files

**Back-end** (`project/back`):
1. Copy `.env.example` to `.env`
2. Fill `SUPABASE_SERVICE_KEY` with the `Secret` value under `Authentication Keys` from the status output above.

**Front-end** (`project/front`):
1. Copy `.env.local.example` to `.env.local`
2. **Mandatory rule:** Always use `import.meta.env.VITE_API_URL` to construct API requests — this ensures seamless transition to production.

---

## 3. Run the Project (Dev Mode)

Four processes must run simultaneously.

**Terminal 1 — Supabase:**
```bash
cd project/back
npx supabase start -x edge-runtime,storage-api
```

**Terminal 2 — Back-end API:**
```bash
cd project/back
mvn spring-boot:run
```

**Terminal 3 — Mock Server:**
> **ARCHITECTURAL REQUIREMENT:** This mock server is mandatory to intercept image uploads and protect your Cloudinary quota in development.
> ⚠️ Regularly empty `/public/mock-uploads` to prevent it from filling up.

```bash
cd project/front
node mock-server.js
```

**Terminal 4 — Front-end (Vite):**
```bash
cd project/front
npm run dev
```

---

## 4. Workflows & Contracts

### 4.1 Database Migrations
> Any modification requires Tech Lead / CTO validation before merging.

1. **Create:** `npx supabase migration new your_feature_name`
2. **Implement:** Write PostgreSQL DDL in `supabase/migrations/`
3. **Test:** `npx supabase db reset` (verifies migration + `seed.sql` integrity)
4. **Merge:** Open a Pull Request

### 4.2 API Contract (Swagger / OpenAPI)
> **CRITICAL STANDARD:** Any undocumented endpoint will result in a rejected Pull Request. The front-end relies on this contract.

- **Swagger UI:** [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **OpenAPI JSON Schema:** [http://localhost:8080/api-docs](http://localhost:8080/api-docs)

**Reference implementations:**
Before writing your first endpoint, you must understand our standard. Strictly follow the structure, Javadoc intent, and annotation rules demonstrated in these two reference files:
1. **Controller:** [`project/back/src/main/java/com/puericulture/common/controller/HealthCheckController.java`](project/back/src/main/java/com/puericulture/common/controller/HealthCheckController.java)
2. **DTO:** [`project/back/src/main/java/com/puericulture/common/dto/HealthCheckResponse.java`](project/back/src/main/java/com/puericulture/common/dto/HealthCheckResponse.java)

### 4.3 Quality Pipeline (Husky)

A pre-commit hook runs automatically on every commit to format and lint your code.

If the pipeline rejects your commit, run manually:

| Side | Command |
|------|---------|
| Front-end | `npm run format` then `npm run lint:fix` |
| Back-end | `mvn spotless:apply` |

---

## 5. Architecture & Deployment (Reference)

**Authentication:** Identity is delegated to Supabase Auth. The front-end obtains a JWT which the back-end (stateless API) validates via Supabase's JWKS endpoint (ES256 signature).

**Back-end deployment:** Automated via GitHub Actions → Render (Docker container).

**Front-end deployment:** Automated via Vercel on push to `main` (no Docker).