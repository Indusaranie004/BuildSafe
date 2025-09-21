# BuildSafe
# SafeBuild - Disaster Resilience App

SafeBuild is a cross-platform mobile app built with **React Native (Expo)** and **Node.js** backend, designed to support disaster resilience efforts.  
The app empowers four key stakeholders — **Disaster Victim, Civil Engineer, Property Owner, Contractor** — through modules such as:

- 📝 **Assessment Management** – collect and submit structural assessment data  
- 📋 **Compliance Management** – apply compliance standards (Drools rules)  
- 📊 **Risk Scoring Engine** – generate risk score (out of 100) using compliance + weather API  
- 🤖 **AI-Based Recommendations** – suggest actions based on risk levels  

---

## 🚀 Tech Stack
- **Frontend:** React Native (Expo) + React Native Paper (UI)  
- **Authentication:** Clerk (Expo SDK)  
- **Backend:** Node.js + Express  
- **Database:** MongoDB (Atlas or local)  
- **APIs:** Weather API (for risk scoring), Drools (for compliance rules)  

---

## 🔑 Prerequisites
- Node.js (v18+ recommended)  
- npm or yarn  
- Expo CLI  
- GitHub Desktop (for collaboration)  
- MongoDB Atlas account (or local MongoDB)  
- Clerk account (only **one shared project** is enough for the whole team)

---

## 🛠️ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/<org-or-username>/SafeBuild.git
cd SafeBuild/mobile
2. Install dependencies
npm install

3. Expo setup

Start the Expo server:

npx expo start

4. Environment variables

Create a .env file in /mobile:

EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
BACKEND_BASE=http://<your-local-ip>:3000


⚠️ Only one team member’s Clerk project should be used. Share the same key across all devs.

5. Run the app

Scan the QR code with Expo Go app (Android/iOS) or run in simulator:

npx expo start --android
# or
npx expo start --ios
