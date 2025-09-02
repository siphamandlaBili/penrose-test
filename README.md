# subscribie
 . admin access: 0000000001 as number then use otp

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm (comes with Node.js)
- MongoDB (local or cloud instance)

### Backend Setup
1. Navigate to the `server` directory:
   ```sh
   cd server
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in `server/` with the following (adjust as needed):
   ```env
   MONGODB_URI=your mongodb uri
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the backend server:
   ```sh
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `front-end` directory:
   ```sh
   cd front-end
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend dev server:
   ```sh
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Tech Choices & Justifications

- **Frontend:** React (Vite, Tailwind CSS, axios, react-hot-toast)
  - Rapid SPA development, modern UI, and easy state management.
  - Tailwind for fast, consistent, and responsive styling.
  - axios for HTTP requests; react-hot-toast for user feedback.
- **Backend:** Node.js (Express, Mongoose, Socket.IO)
  - Express for RESTful APIs and middleware flexibility.
  - Mongoose for MongoDB ODM and schema validation.
  - Socket.IO for real-time updates (subscriptions, etc).
- **Database:** MongoDB
  - Flexible document model, easy to seed and query for subscription app use cases.
- **Auth:** OTP-based (simulated), JWT for session management.
  - Simulates real-world mobile onboarding and secure API access.
- **Other:**
  - HeadlessUI for accessible UI components.
  - dotenv for environment config.

---

## API Documentation

### Auth
- `POST /api/auth/send-otp`  
  Request: `{ msisdn }`  
  Response: `{ otp }` (simulated)

- `POST /api/auth/verify-otp`  
  Request: `{ msisdn, otp }`  
  Response: `{ token }`

- `POST /api/auth/register`  
  Request: `{ msisdn, name, provider }`  
  Response: `{ user, otp }`

- `POST /api/auth/logout`  
  Logs out the user (clears cookie/session).

### User
- `GET /api/user/profile`  
  Returns: `{ msisdn, provider, airtime, memberSince, ... }`

### Services
- `GET /api/services`  
  Returns: `[ { _id, name, description, price, category, billingCycle, ... } ]`

### Subscriptions
- `GET /api/subscriptions`  
  Returns: `[ { _id, serviceId, status, ... } ]`

- `POST /api/subscriptions`  
  Request: `{ serviceId }`  
  Response: `{ subscription, billing }`

- `DELETE /api/subscriptions/:subscriptionId`  
  Unsubscribes user from a service.

### Transactions
- `GET /api/transactions`  
  Returns: `[ { _id, msisdn, serviceId, amount, type, timestamp } ]`

### Admin (Admin access only)
- `GET /api/admin/profile`  
  Returns: `{ msisdn, name, provider, airtime, isAdmin, memberSince }`

- `GET /api/admin/active-users-per-service`  
  Returns: `[ { serviceId, serviceName, activeUserCount } ]`

---

## Notes
- OTPs are simulated and shown in the UI (no real SMS integration).
- Airtime is randomly assigned on registration and deducted on subscription.
- Telco billing is simulated (Vodacom/MTN selection).
- Real-time updates via Socket.IO for subscriptions.
- Transaction history and profile info are available in the dashboard.
- **Admin Access**: Admin user with MSISDN `0000000001` is automatically seeded on server startup with full administrative privileges.
