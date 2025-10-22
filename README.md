# Credit Card Statement Parser

A comprehensive PDF parser that extracts key data points from credit card statements across 5 major credit card issuers, with visual spending insights and export capabilities.

## Features

### PDF Parsing
- **5 Major Credit Card Issuers**:
- **5 Key Data Points Extracted**:
  - Transaction information (date, description, amount)
  - Card issuer identification
  - Card last 4 digits
  - Billing cycle period
  - Payment due date
  - Total balance due

### Visual Analytics
- Interactive spending dashboard with charts and insights
- Category-based spending analysis
- Merchant spending breakdown
- Spending trend analysis
- Payment due date tracking

### Export Capabilities
- **CSV Export**: Download transaction data as CSV
- **Google Sheets Integration**: Export directly to Google Sheets with formatting
- **Summary Reports**: Copy spending summaries to clipboard

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: Radix UI, Tailwind CSS
- **Charts**: Recharts
- **PDF Processing**: pdf-parse, Tesseract.js
- **Backend**: Next.js API Routes
- **Database**: Firebase Firestore
- **Export**: Google Sheets API

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (Server-side)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com

# Google Sheets API
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

### 3. Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Generate a service account key for server-side operations
4. Add the configuration values to your `.env.local` file

### 4. Google Sheets API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Sheets API
4. Create a service account and download the JSON key
5. Add the service account email and private key to your `.env.local` file

### 5. Run the Application

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

1. **Upload Statement**: Drag and drop or select a PDF credit card statement
2. **View Analytics**: Navigate to the dashboard to see spending insights
3. **Export Data**: Use the export section to download CSV or export to Google Sheets

## Supported Credit Card Issuers

- **Chase**: Chase Sapphire, Freedom, etc.
- **American Express**: Amex Gold, Platinum, etc.
- **Capital One**: Venture, Quicksilver, etc.
- **Citi**: Double Cash, Premier, etc.
- **Discover**: It, Chrome, etc.

## PDF Parser Features

The PDF parser uses advanced text extraction and pattern matching to identify:
- Transaction dates and amounts
- Merchant names and descriptions
- Statement periods and due dates
- Card information
- Balance details

## Architecture

```
├── app/
│   ├── api/
│   │   ├── parse-pdf/          # PDF parsing endpoint
│   │   └── export-google-sheets/ # Google Sheets export
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                     # Reusable UI components
│   ├── upload-section.tsx      # PDF upload interface
│   ├── insights-dashboard.tsx  # Analytics dashboard
│   ├── transaction-table.tsx   # Transaction management
│   └── export-section.tsx      # Export functionality
├── lib/
│   ├── firebase.ts            # Firebase client config
│   ├── firebase-admin.ts      # Firebase admin config
│   ├── pdf-parser.ts          # PDF parsing logic
│   └── utils.ts               # Utility functions
└── hooks/                     # Custom React hooks
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
