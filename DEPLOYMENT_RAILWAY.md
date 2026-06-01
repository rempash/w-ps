# Railway Deployment Guide (Backend)

This document contains the step-by-step instructions to deploy the NestJS backend to [Railway](https://railway.app/).

## Prerequisites
- The backend port has already been adjusted to use `process.env.PORT ||   ` (so Railway can inject the correct port).
- The code must be pushed to a GitHub repository.

## Step-by-Step Deployment

### 1. Connect GitHub Repository
1. Log into your [Railway Dashboard](https://railway.app/dashboard).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select your repository. 
4. *Important:* If your repository is a monorepo containing both `frontend` and `backend`, go to the new Web Service's Settings -> **Root Directory** and set it to `/backend`.

### 2. Provision MongoDB
1. In the Railway project view, click the **Create** or **New** button (+).
2. Choose **Database** -> **Add MongoDB**.
3. Railway will provision a MongoDB instance and automatically create internal connection variables (like `MONGO_URL`).

### 3. Configure Environment Variables
Navigate to your backend web service, open the **Variables** tab, and add the following environment variables:

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `MONGODB_URI` | `${MONGO_URL}` | This links your NestJS app to Railway's provisioned MongoDB. |
| `GEMINI_API_KEY` | *(Your Gemini API Key)* | The authentication key for the LLM. |
| `USE_MOCK_LLM` | `false` | (Optional) Ensure mock LLM is turned off in production. |

### 4. Setup Custom Start Command
Railway automatically detects `package.json` and runs `npm install` and `npm run build`. However, we want to ensure it runs the optimized production bundle instead of the default dev script.

1. Go to your backend service's **Settings** tab.
2. Scroll down to the **Deploy** section.
3. Find **Start Command** and set it to:
   ```bash
   npm run start:prod
   ```

### 5. Finalize Deployment
Once the variables and start command are configured, Railway should automatically trigger a redeploy (if not, you can manually click "Deploy" or push a new commit to trigger it). You can monitor the logs in the **Deployments** tab to ensure the server starts up correctly!


### backend url
w-ps-production.up.railway.app