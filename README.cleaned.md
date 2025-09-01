# Subscribie VAS Platform

A modern Value-Added Services (VAS) subscription platform with OTP login, telco billing abstraction, real-time dashboards, and a polished admin/user experience.

---

## Features
- **User & Admin Dashboards**: Real-time stats, charts, and management tools
- **OTP Login**: Secure, mobile-friendly authentication
- **MongoDB**: Flexible, scalable data storage
- **Telco Billing Abstraction**: Easily integrate with multiple telcos
- **Rate Limiting**: Prevent abuse and ensure fair usage
- **Modern UI/UX**: Responsive, consistent, and accessible (React + Tailwind)
- **Real-Time Updates**: Socket.IO-powered live stats
- **Admin Tools**: Add/manage services, view active users, and more

---

## Getting Started

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
   MONGODB_URI=your_mongodb_uri
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

## Project Structure

```
penrose-test/
├── front-end/         # React + Vite + Tailwind (SPA)
│   ├── src/
│   │   ├── pages/     # All user/admin dashboard pages
│   │   ├── components/# Shared UI components
│   │   └── ...
│   ├── public/
│   └── ...
├── server/            # Express.js backend API
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── ...
└── README.md
```

---


## Usage

### User Flow
- Register/login with your mobile number (OTP is simulated and shown in the UI)
- Browse available services and subscribe/unsubscribe
- View your subscriptions, transaction history, and profile
- All user dashboards update in real time

### Admin Flow
- **Admin login is hardcoded.** Use the following credentials to log in as admin:

   - **MSISDN:** 27831234567
   - **OTP:** 123456

- After logging in as admin, you can:
   - Add new services (name, description, price, category, billing cycle)
   - View real-time stats for all services and users
   - See active users per service and usage charts
   - All admin dashboards update in real time

### Notes
- OTPs are simulated (no real SMS is sent)
- Admin login is only possible with the above hardcoded credentials
- Telco billing is simulated (Vodacom/MTN selection)
- Airtime is randomly assigned on registration and deducted on subscription
- Real-time updates are powered by Socket.IO

---

## License
MIT
