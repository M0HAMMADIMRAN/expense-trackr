💰 Expense Tracker

An Expense Tracking Web App built with React, Firebase, and Bootstrap that helps users manage their spending.
It allows manual expense entry, Google/Email authentication, bank statement uploads (planned), and visualizes expenses with Pie/Bar charts for better financial insights.

✨ Features

🔐 Authentication:

Email & Password Login/Signup

Google Sign-In with Firebase Authentication

📊 Expense Management:

Add daily expenses with amount, description, and category

Categorized view (Food, Travel, Bills, Shopping, Other)

Persistent storage using Firebase Firestore

📈 Visualizations:

Colorful Pie Chart → Expense breakdown by category

Bar Chart → Monthly expenditure trend

📂 Planned Updates(Future Updates if require):

Upload Bank Statements (CSV/Excel) → Auto-categorize & visualize

Integration with UPI apps (Paytm, PhonePe) for automatic tracking

🛠️ Tech Stack

Frontend: React + Vite

UI Framework: Bootstrap 5 + Bootstrap Icons

Charts: React-ChartJS-2 + Chart.js

Authentication & Database: Firebase Authentication + Firestore

Routing: React Router

🚀 Getting Started

1️⃣ Clone the Repository

git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker

2️⃣ Install Dependencies

npm install

3️⃣ Configure Firebase

Create a Firebase project → Enable Authentication & Firestore Database.

Enable Google Sign-In in Authentication → Sign-in Methods.

Copy Firebase config and add it to .env:

VITE_FIREBASE_API_KEY=your_api_key

VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com

VITE_FIREBASE_PROJECT_ID=your_project_id

VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com

VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id

VITE_FIREBASE_APP_ID=your_app_id

4️⃣ Run Locally

npm run dev


Visit 👉 http://localhost:5173

🔐 Firestore Security Rules

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/expenses/{expenseId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}

📸 Screenshots

Sign In Page	

<img width="1903" height="871" alt="image" src="https://github.com/user-attachments/assets/c76d8338-312f-40e2-afe0-7fa075cb4ced" />

Dashboard with Charts

<img width="1905" height="881" alt="image" src="https://github.com/user-attachments/assets/68196fa0-5dc9-47c3-a098-bed070a25119" />


📅 Roadmap

✅ Manual expense tracking

✅ Authentication (Email + Google)

✅ Pie/Bar charts visualization

🔜 Bank statement upload (CSV/Excel)

🔜 Automatic categorization with ML

🔜 Integration with UPI apps (Paytm/PhonePe)
