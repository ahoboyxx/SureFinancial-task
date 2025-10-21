# 🔥 Firebase Realtime Database Setup Guide

## **Step-by-Step Setup (5 minutes)**

### **Step 1: Create Firebase Project**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** or **"Add project"**
3. Enter project name: `credit-card-parser`
4. **Disable Google Analytics** (optional)
5. Click **"Create project"**

### **Step 2: Enable Realtime Database**
1. In your Firebase project, click **"Realtime Database"** in the left sidebar
2. Click **"Create Database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location (choose closest to your users)
5. Click **"Done"**

### **Step 3: Get Database URL**
After creating the database, you'll see a URL like:
```
https://your-project-id-default-rtdb.firebaseio.com/
```
**Copy this URL** - you'll need it for environment variables.

### **Step 4: Get Firebase Configuration**
1. Go to **Project Settings** (gear icon in top left)
2. Scroll down to **"Your apps"** section
3. Click the **Web app** icon (`</>`)
4. Register your app:
   - App nickname: `Credit Card Parser`
   - **Don't** check "Also set up Firebase Hosting"
   - Click **"Register app"**
5. **Copy the Firebase configuration object**

### **Step 5: Create Environment Variables**
Create a `.env.local` file in your project root:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com/
```

### **Step 6: Enable Authentication (Optional)**
1. Go to **"Authentication"** in the left sidebar
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **"Email/Password"** provider
5. Click **"Save"**

### **Step 7: Test Your Setup**
1. Restart your development server: `npm run dev`
2. Open http://localhost:3000
3. You should see a **"Database Toggle"** component
4. Switch between **"Local Storage"** and **"Firebase Database"**
5. Upload a PDF or use demo mode to test

## **🎯 What You Get with Firebase Realtime Database:**

### **Free Tier Limits:**
- ✅ **100 concurrent connections**
- ✅ **1GB storage**
- ✅ **10GB/month transfer**
- ✅ **No daily read/write limits**

### **Features:**
- ✅ **Real-time sync** across devices
- ✅ **Cloud backup** of your data
- ✅ **User authentication** (optional)
- ✅ **Offline support**
- ✅ **Automatic scaling**

## **🔧 Troubleshooting**

### **Common Issues:**

1. **"Firebase: Error (auth/configuration-not-found)"**
   - Check your `.env.local` file exists
   - Verify all environment variables are correct
   - Restart the development server

2. **"Firebase: Error (auth/invalid-api-key)"**
   - Double-check your API key in Firebase Console
   - Ensure no extra spaces in environment variables

3. **"Firebase: Error (permission-denied)"**
   - Check your database rules in Firebase Console
   - Make sure you're in "test mode"

### **Database Rules (Test Mode):**
Your database should have these rules for testing:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

## **💰 Cost Comparison**

| Feature | Local Storage | Firebase Realtime DB |
|---------|---------------|---------------------|
| **Setup** | ✅ Free | ✅ Free |
| **Storage** | ✅ Unlimited | ✅ 1GB free |
| **Reads** | ✅ Unlimited | ✅ Unlimited |
| **Writes** | ✅ Unlimited | ✅ Unlimited |
| **Sync** | ❌ No | ✅ Real-time |
| **Backup** | ❌ No | ✅ Automatic |

## **🚀 Ready to Use!**

Once you complete the setup:
1. **Your data syncs** across all devices
2. **Real-time updates** when you add statements
3. **Cloud backup** of all your data
4. **User authentication** for privacy
5. **Offline support** when you're not connected

**Your app now has enterprise-grade data storage!** 🎉
