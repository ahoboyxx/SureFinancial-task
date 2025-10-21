# Firebase Setup Guide for Credit Card Statement Parser

## 🔥 Firebase Project Setup

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `credit-card-parser` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Authentication
1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click **Get Started**
3. Go to **Sign-in method** tab
4. Enable **Email/Password** provider:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

### Step 3: Enable Firestore Database
1. Go to **Firestore Database** in the left sidebar
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location (choose closest to your users)
5. Click **Done**

### Step 4: Get Firebase Configuration
1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click **Web app** icon (`</>`)
4. Register your app:
   - App nickname: `Credit Card Parser`
   - Check "Also set up Firebase Hosting" (optional)
   - Click **Register app**
5. Copy the Firebase configuration object

### Step 5: Create Service Account (for server-side operations)
1. Go to **Project Settings** → **Service accounts** tab
2. Click **Generate new private key**
3. Download the JSON file (keep it secure!)
4. Extract the following values:
   - `project_id`
   - `client_email`
   - `private_key`

## 🔧 Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```env
# Firebase Client Configuration (from Step 4)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin Configuration (from Step 5)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com

# Google Sheets API (Optional - for export functionality)
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

## 🔐 Security Rules (Optional but Recommended)

### Firestore Security Rules
Go to **Firestore Database** → **Rules** and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /statements/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Allow users to create new statements
    match /statements/{document} {
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### Storage Security Rules (if using Firebase Storage)
Go to **Storage** → **Rules** and replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /statements/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🚀 Testing Authentication

1. Start your development server: `npm run dev`
2. Open http://localhost:3000
3. Click "Sign In" button
4. Create a new account or sign in
5. Test the authentication flow

## 📱 User Management

### View Users
- Go to **Authentication** → **Users** in Firebase Console
- See all registered users
- Manage user accounts

### User Data Storage
- User statements are stored in Firestore
- Each statement is linked to the user's UID
- Data is automatically secured by authentication

## 🔧 Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/configuration-not-found)"**
   - Check your environment variables
   - Ensure `.env.local` is in the project root
   - Restart the development server

2. **"Firebase: Error (auth/invalid-api-key)"**
   - Verify your API key in Firebase Console
   - Check for typos in environment variables

3. **"Firebase: Error (auth/email-already-in-use)"**
   - User already exists, try signing in instead
   - Or use a different email

4. **"Firebase: Error (auth/weak-password)"**
   - Password must be at least 6 characters

### Debug Mode:
Add this to your `.env.local` for detailed error messages:
```env
NEXT_PUBLIC_FIREBASE_DEBUG=true
```

## 🎯 Next Steps

1. **Test the application** with demo mode
2. **Upload real PDFs** to test parsing
3. **Create user accounts** to test authentication
4. **Export data** to test Google Sheets integration
5. **Deploy to production** when ready

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Next.js Firebase Integration](https://firebase.google.com/docs/web/setup)
