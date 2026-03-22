# HealthTech: Deployment & Administration Notes

## Recommended Hosting

**Vercel** is the officially recommended hosting platform for both the frontend and backend components of this project.

- **Backend API (`health-connect-api`)**: Pre-configured for Vercel Serverless Functions. The directory already contains a `vercel.json` file utilizing the `@vercel/node` builder for seamless execution.
- **Frontend Web App (`health-connect`)**: Built with Next.js 16, which is natively supported and best optimized on Vercel.

**Alternatives:**  
While Vercel provides a zero-config experience, you can reliably host the Next.js frontend on **AWS Amplify** or **Firebase Hosting**. The Express backend can similarly be containerized and run cleanly on **Render**, **Railway**, or **AWS App Runner**.

---

## Deploying to Vercel (Step-by-Step)

Because this project is separated into a frontend and a backend, you will create two separate projects in Vercel.

### 1. Deploy the Backend (`health-connect-api`)
1. Push your code to GitHub, GitLab, or Bitbucket.
2. Go to your [Vercel Dashboard](https://vercel.com/) and click **Add New... > Project**.
3. Import your repository.
4. **Important**: In the Root Directory section, click Edit and select `health-connect-api`.
5. The deployment configuration will automatically read the `vercel.json` file.
6. (Optional) In Environment Variables, add `ADMIN_PASSWORD` (e.g., `Value: my_secure_password`).
7. Click **Deploy**. Once finished, copy the generated URL (e.g., `https://healthtech-api.vercel.app`).

### 2. Deploy the Frontend (`health-connect`)
1. Go back to your [Vercel Dashboard](https://vercel.com/) and click **Add New... > Project** to create a second project.
2. Import the *same* repository again.
3. In the Root Directory section, click Edit and select `health-connect` this time.
4. The Framework Preset should automatically switch to **Next.js**.
5. In Environment Variables, add:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: The URL you copied from Step 1 (e.g., `https://healthtech-api.vercel.app`). *Trailing slashes are preffered to be manually handled.*
6. Click **Deploy**.

---

## Database Configuration & Setup

**No database setup is required.**

The project is currently designed as a comprehensive frontend and API prototype utilizing a purely **in-memory data store**. 
- All data objects (Users, Bookings, OTP instances, and Schedule locked statuses) are managed dynamically in memory (refer to `src/store.ts` in the API).
- There are **no external databases**, connection strings, schemas, or migrations to provision (e.g., no Postgres or MongoDB required).

*Note for Serverless Deployments:* Because the store is in-memory, platforms like Vercel will periodically clear data between server "cold starts". This works perfectly for a stateless demo presentation.

---

## Important Environment Setup on Deployment

When pushing to your chosen hosting provider, ensure you set these values in their Environment Variables dashboard:

- **Frontend Project**:  
  `NEXT_PUBLIC_API_URL` -> Set to your live backend domain (e.g., `https://healthtech-api.vercel.app`).
- **Backend Project**:  
  `ADMIN_PASSWORD` -> (Optional) Set to a highly secure passphrase for production. If omitted, it will gracefully fall back to the demo value below.

---

## System Administration & Login

The platform contains operational and configuration dashboards securely locked behind an administration login.

- **Authentication Type:** Shared password configuration 
- **Default Password:** `admin123`

**How it works:** 
The API (`src/routes/admin.ts`) relies on this default fallback if no `ADMIN_PASSWORD` environment variable is configured. When running locally or showing a clean demo, simply enter `admin123` in the admin login UI to access the Schedule Optimizer and bookings dashboard.
