# Admin Usage Example

## Admin Details Configuration

The admin user has been configured with the following details:

- **MSISDN**: `0000000001` (exactly as requested)
- **Name**: `System Administrator`
- **Provider**: `vodacom`
- **Airtime**: `9999` (unlimited for admin)
- **IsAdmin**: `true`

## Admin Auto-Seeding

The admin user is automatically created when the server starts via `seedAdmin.js`. The admin will be created with:

```javascript
{
  msisdn: '0000000001',
  name: 'System Administrator', 
  provider: 'vodacom',
  airtime: 9999,
  isAdmin: true
}
```

## Admin API Endpoints

Once authenticated as admin (using MSISDN `0000000001`), the following endpoints are available:

1. **Get Admin Profile**
   - `GET /api/admin/profile`
   - Returns admin user details

2. **Get Active Users Per Service** 
   - `GET /api/admin/active-users-per-service`
   - Returns statistics for admin dashboard

## Authentication Flow for Admin

1. Send OTP to `0000000001`: `POST /api/auth/send-otp`
2. Verify OTP: `POST /api/auth/verify-otp` 
3. Access admin endpoints with authentication cookie

The admin user will be automatically recognized as having administrative privileges through the `isAdmin: true` flag.