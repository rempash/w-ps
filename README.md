# Serenity: AI Psychology Support App

Serenity is a premium AI-based psychology support application designed specifically for women. It provides an empathetic, supportive, and non-judgmental space for emotional well-being using advanced AI.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or later
- **Docker**: To run MongoDB and Qdrant
- **Expo Go**: (Optional) To run the mobile app on your physical device

### 1. Infrastructure Setup

Start the databases (MongoDB and Qdrant) using Docker Compose:

```bash
docker-compose up -d
```

### 2. Backend Setup (NestJS)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   MONGODB_URI=mongodb://localhost:27017/ai-psychology
   ```
4. Run the backend in development mode:
   ```bash
   npm run start:dev
   ```
   The API will be available at `http://localhost:3000`.

### 3. Mobile App Setup (Expo/React Native)

1. Navigate to the mobile directory:
   ```bash
   cd mobile
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo development server:
   ```bash
   npx expo start
   ```
4. Open the app:
   - Press **`a`** for Android emulator.
   - Press **`i`** for iOS simulator (macOS only).
   - Scan the QR code with the **Expo Go** app on your phone.

---

## 🛠 Tech Stack

- **Mobile**: React Native, Expo, Reanimated, Lucide Icons.
- **Backend**: NestJS, MongoDB (via Mongoose), Qdrant (Vector Storage).
- **AI**: OpenAI GPT-3.5/4 with custom empathetic system prompts.

## ✨ Features

- [x] **Premium UI**: Soft pastel aesthetics with glassmorphism.
- [x] **AI Companion**: Empathetic chat interface with persistent memory.
- [ ] **Mood Tracking**: Daily emotional check-ins (Coming soon).
- [ ] **Supportive Exercises**: Mindfulness and breathing guides (Coming soon).
