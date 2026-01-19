# DonateHub

A full-stack web application for managing NGO operations, user registrations, and donation processing. Built with Django REST Framework and React, this platform enables seamless donation management, user authentication, and administrative oversight.

## 🌟 Features

### User Features

- **User Registration & Authentication**: Secure signup/login with JWT tokens
- **Profile Management**: Update personal information and profile pictures
- **Donation System**: Make donations with integrated payment processing
- **Donation History**: Track all past donations and their statuses
- **Protected Routes**: Secure access to user-specific features

### Admin Features

- **Admin Dashboard**: Comprehensive overview with statistics and charts
- **User Management**: View and manage registered users
- **Donation Management**: Monitor and process donation requests
- **Analytics**: Visual representation of donation trends
- **Export to CSV**: Download donation and user data in CSV format for reporting
- **Notification System**: Automated notifications for users and admins

## 🛠️ Tech Stack

### Backend

- **Framework**: Django 6.0.1
- **Database**: PostgreSQL (via psycopg2-binary)
- **API**: Django REST Framework
- **Authentication**: JWT-based authentication
- **Environment Management**: python-dotenv

### Frontend

- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 3.4.17
- **State Management**: Redux Toolkit 2.11.2
- **Routing**: React Router DOM 7.12.0
- **Charts**: Chart.js 4.5.1 with react-chartjs-2
- **Payment**: Stripe integration (@stripe/react-stripe-js, @stripe/stripe-js)
- **Icons**: Lucide React

## 📁 Project Structure

```
NSS PROJECT/
├── backend/
│   ├── apps/
│   │   ├── accounts/        # User authentication & profile management
│   │   ├── donations/       # Donation handling & processing
│   │   └── notification/    # Notification system
│   ├── config/              # Django project settings
│   ├── media/              # User uploaded files
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── pages/         # Application pages
    │   ├── services/      # API service layer
    │   └── store/         # Redux store configuration
    ├── public/
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL
- npm or yarn

### Backend Setup

1. **Navigate to the backend directory**

   ```bash
   cd backend
   ```

2. **Create a virtual environment**

   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables**
   Create a `.env` file in the backend directory:

   ```env
   DEBUG=True
   SECRET_KEY=your-secret-key
   DATABASE_NAME=your-database-name
   DATABASE_USER=your-database-user
   DATABASE_PASSWORD=your-database-password
   DATABASE_HOST=localhost
   DATABASE_PORT=5432

   # Stripe Configuration
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

   **To get your Stripe keys:**
   1. Create a Stripe account at [https://stripe.com](https://stripe.com)
   2. Navigate to the Developers section
   3. Go to API keys to find your publishable and secret keys
   4. For webhooks, go to Webhooks section and create an endpoint

6. **Run migrations**

   ```bash
   python manage.py migrate
   ```

7. **Create a superuser**

   ```bash
   python manage.py createsuperuser
   ```

8. **Install Stripe CLI (Optional but recommended for testing webhooks)**
   - Download from [https://stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)
   - Login to Stripe CLI:
     ```bash
     stripe login
     ```
   - Forward webhooks to your local server:
     ```bash
     stripe listen --forward-to localhost:8000/api/donations/webhook/
     ```

9. **Start the development server**

   ```bash
   python manage.py runserver
   ```

   The backend will be available at `http://localhost:8000`

### Exposing Backend with ngrok (For Stripe Webhooks & Remote Access)

To test Stripe webhooks or access your backend from external services, you can use ngrok to expose your local server:

1. **Install ngrok**
   - Download from [https://ngrok.com/download](https://ngrok.com/download)
   - Create a free account and authenticate:
     ```bash
     ngrok authtoken YOUR_AUTH_TOKEN
     ```

2. **Start ngrok tunnel**

   ```bash
   ngrok http 8000
   ```

3. **Configure Stripe webhook**
   - Copy the HTTPS URL provided by ngrok (e.g., `https://abc123.ngrok.io`)
   - Go to your Stripe Dashboard → Webhooks
   - Add endpoint: `https://abc123.ngrok.io/api/donations/webhook/`
   - Copy the webhook signing secret and update your `.env` file

4. **Update frontend environment**
   - Update `VITE_API_URL` in frontend `.env` to use the ngrok URL:
     ```env
     VITE_API_URL=https://abc123.ngrok.io/api
     ```

   **Note**: ngrok URLs change each time you restart the tunnel (free tier). For persistent URLs, consider upgrading to a paid ngrok plan.

### Frontend Setup

1. **Navigate to the frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the frontend directory:

   ```env
   VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
   ```

   **Note**: Use the same Stripe public key from your Stripe dashboard

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## � Test Card Details for Payment

For testing the Stripe payment integration, use the following test card numbers:

### Successful Payment

- **Card Number**: `4242424242424242`
- **Expiry Date**: Any future date (e.g., 12/25)
- **CVV**: Any 3-digit number (e.g., 123)

### Failed Payment

- Use any valid card number other than the one mentioned above


## �📋 Available Scripts

### Backend

- `python manage.py runserver` - Start development server
- `python manage.py migrate` - Run database migrations
- `python manage.py makemigrations` - Create new migrations
- `python manage.py createsuperuser` - Create admin user
- `python manage.py test` - Run tests

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔑 API Endpoints

### Authentication

- `POST /api/accounts/register/` - User registration
- `POST /api/accounts/login/` - User login
- `POST /api/accounts/refresh/` - Refresh access token

### User Management

- `GET /api/accounts/profile/` - Get user profile
- `PUT /api/accounts/profile/` - Update user profile
- `GET /api/accounts/users/` - List all users (Admin only)

### Donations

- `POST /api/donations/create/` - Create new donation
- `GET /api/donations/` - List donations
- `GET /api/donations/{id}/` - Get donation details
- `PUT /api/donations/{id}/` - Update donation status
- `GET /api/donations/export/csv/` - Export donations to CSV (Admin only)

## 🎨 Key Components

### Frontend Components

- **ProtectedRoute**: Secures routes requiring authentication
- **Sidebar**: User navigation component
- **Adminsidebar**: Admin navigation component
- **DonationChart**: Visualizes donation analytics
- **StatCard**: Displays statistical information
- **Checkout**: Stripe payment integration

### Backend Apps

- **accounts**: Handles user authentication, registration, and profile management
- **donations**: Manages donation creation, processing, and tracking
- **notification**: Sends notifications to users and admins

## 🔒 Security Features

- JWT-based authentication
- Password hashing
- Protected API endpoints
- CORS configuration
- Environment variable management
- SQL injection prevention (Django ORM)

## 👥 Authors

- Rudra Pratap Singh
- Atharv Garg
- Alok Prajapati

**Note**: Make sure to configure your database and environment variables before running the application.
