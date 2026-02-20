# Missing Features Roadmap (IBSA Homes PMS)

Based on the original proposal (`LIBAN.docx`) vs current implementation, here are the missing features sorted from **Critical** to **Less Critical**:

## 🔴 Critical (Must Have for true SaaS Platform)

### 1. Multi-Tenancy / Organization Isolation
- **Status:** Missing
- **Impact:** Critical for a SaaS. Currently, the system assumes one global agency. If two distinct landlords sign up, they would see each other's data, or the global `SystemSettings` would conflict.
- **Action Required:** Introduce an `Organization` or `Agency` model. Tie `Property`, `TenantProfile`, `User`, and `SystemSettings` to an Organization ID to securely isolate data so multiple independent agencies can use the app concurrently.

### 2. Landlord/Owner Entity Assignment
- **Status:** Missing
- **Impact:** Critical for tracking ownership vs management. Right now, properties belong to an `Agent`. The platform needs to support Landlords logging in to see the performance of their *owned* properties.
- **Action Required:** Add an `ownerId` (Landlord profile reference) to the `Property` model. Create a dedicated Landlord dashboard with restricted analytics views showing only their owned assets.

### 3. Payment Gateway Integration
- **Status:** Missing
- **Impact:** Essential for user flow. Currently, you have a `Payment` table acting as a manual log, but tenants cannot actually perform an online payment.
- **Action Required:** Integrate Stripe, PayPal, or a local gateway (e.g., M-Pesa). Allow tenants to pay via the app, generating an automatic receipt and updating the `Payment` ledger upon successful webhook confirmation.

---

## 🟡 High Priority (Core Business Logic)

### 4. Automated Rent Generation & Invoicing
- **Status:** Missing
- **Impact:** High. Rent should not be a manual entry. The system must know a tenant's lease and bill them automatically.
- **Action Required:** Implement a background cron job (e.g., running on the 1st of every month) that generates "Due Rent" invoices for all active `TenantProfile`s based on their associated `Property` price.

### 5. Platform Monetization / Subscription Billing
- **Status:** Missing
- **Impact:** High. As a SaaS creator, you need a way to charge the landlords or agents for using your software.
- **Action Required:** Implement tiered subscriptions (e.g., Free for up to 5 properties, Pro for unlimited) using Stripe Billing to charge the Landlord/Agency owners.

---

## 🔵 Medium Priority (User Experience Enhancements)

### 6. Robust Notification System (Email/SMS)
- **Status:** Missing
- **Impact:** Medium. Currently, users must log in to check for updates on maintenance, bookings, and rent.
- **Action Required:** Integrate an Email provider (Resend/SendGrid) or SMS provider (Twilio). Send automated alerts for:
  - Rent due reminders (3 days before).
  - Maintenance ticket status updates.
  - New booking requests to agents.

### 7. Financial Reporting & Analytics Dashboards
- **Status:** Missing
- **Impact:** Medium. Lack of deep data visualization.
- **Action Required:** Build robust charts calculating Monthly Recurring Revenue (MRR), trailing 12-month earnings, outstanding balances, and total maintenance expenses across selected date ranges.

---

## 🟢 Low Priority (Future Expansions)

### 8. Digital Lease Agreements (e-Signing)
- **Status:** Missing
- **Impact:** Low. Leases are currently handled offline.
- **Action Required:** Generate PDF leases automatically with dynamic tenant/property data and integrate a basic e-signature flow.

### 9. Advanced Tenant Screening
- **Status:** Missing
- **Impact:** Low. Vetting is manual right now.
- **Action Required:** Integrate with a 3rd-party background/credit check API for agents to vet prospective tenants applying for a property.
