# 📦 Logistics Automation Platform – Frontend

A modern React-based frontend for the Logistics Automation Platform, enabling seamless logistics management for users and administrators. Features secure authentication, intuitive file uploads, real-time record viewing, and advanced analytics—all integrated with AWS services and role-based access via Cognito.

---

## 🚀 Features

- **Secure AWS Cognito Authentication**  
    Robust login and session management for users and admins.
- **Flexible File Uploads**  
    Upload delivery data in CSV or Excel formats, organized by company.
- **Comprehensive Record Management**  
    View, filter, and track delivery records and upload history.
- **Admin Analytics Dashboard**  
    Visualize logistics data, export analytics as PDF, and monitor company contributions.
- **Role-Based Access Control**  
    Dynamic content rendering based on user roles (admin vs. regular user).

---

## 🏗️ Project Structure

```
logistics-frontend/
├── public/                        # Static assets, index.html, etc.
├── src/
│   ├── api/
│   │   └── apiClient.js           # API calls with authentication
│   ├── components/
│   │   ├── admin/
│   │   │   ├── CompanyContributionShareCard.js
│   │   │   ├── DownloadAnalyticsReportButton.js
│   │   │   ├── DeliveryVolumeHeatmap.js
│   │   │   ├── RoutePerformanceSummary.js
│   │   │   ├── StatusProgressBreakdownCard.js
│   │   │   └── ...                # Additional analytics components
│   │   ├── AdminDashboard.js      # Analytics panel for admins
│   │   ├── UserDashboard.js       # Dashboard for regular users
│   │   ├── RecordsViewer.js       # Logistics records viewer
│   │   ├── FileUpload.js          # File upload component
│   │   └── ...                    # Shared components
│   ├── pages/
│   │   └── Dashboard.js           # Routing between admin/user sections
│   ├── App.js                     # Root component (routing/auth)
│   ├── index.js                   # Entry point
│   ├── index.css                  # TailwindCSS/global styles
│   └── ...
├── .env                           # Environment variables
├── package.json
├── README.md
└── ...                            # Config files (.gitignore, etc.)
```

---

## ⚙️ Environment Setup

Create a `.env` file in the project root with the following configuration:

```env
# AWS Cognito Authentication
REACT_APP_COGNITO_AUTHORITY=https://<your-cognito-domain>.auth.<region>.amazoncognito.com
REACT_APP_COGNITO_CLIENT_ID=<your-client-id>
REACT_APP_COGNITO_REDIRECT_URI=https://your-frontend-url.com
REACT_APP_COGNITO_RESPONSE_TYPE=code
REACT_APP_COGNITO_SCOPE=openid profile email

# API Gateway Endpoint
REACT_APP_API_BASE_URL=https://<your-api-id>.execute-api.<region>.amazonaws.com/prod

# Logout and Domain
REACT_APP_COGNITO_LOGOUT_URI=https://your-frontend-url.com
REACT_APP_COGNITO_DOMAIN=https://<your-cognito-domain>.auth.<region>.amazoncognito.com

# (Optional) S3 Configuration
S3_BUCKET_NAME=xyz-logistics-s3
S3_BUCKET_REGION=eu-north-1
```

> **Important:** Never commit your `.env` file to version control.

---

## 🛠️ Installation & Local Development

```bash
# Clone the repository
git clone https://github.com/your-org/logistics-frontend.git
cd logistics-frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The app will be available at [https://logistic-frontend-drab.vercel.app/](https://logistic-frontend-drab.vercel.app/).

---

## 🧠 Key Technologies

- **React** & **Tailwind CSS** for UI
- [`react-oidc-context`](https://github.com/authts/react-oidc-context) for Cognito authentication
- **AWS Cognito** (User Pools & Groups)
- **AWS API Gateway** & **Lambda**
- **AWS S3** & **DynamoDB**
- **jsPDF** & **html2canvas** for PDF export

---

## 🧪 Testing

Manual testing steps:

- Log in as both admin and regular user
- Upload delivery files
- View and filter records
- Access analytics dashboard (admin)
- Download analytics as PDF
- Verify email notifications

> Automated test coverage is not yet implemented.

---

## 📄 License

Developed as part of a university assignment. Intended for academic and internal demonstration purposes only.

---

## ✍️ Author

**Sumuditha L.**  
APIIT | 2025  
[sumudithalanz@gmail.com](mailto:sumudithalanz@gmail.com)
