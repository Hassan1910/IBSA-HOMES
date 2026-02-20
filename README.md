<div align="center">
  <img src="https://placehold.co/800x200/4F46E5/FFFFFF/png?text=IBSA+HOMES" alt="IBSA HOMES Banner" />

  <h1 align="center">IBSA-HOMES Property Management System</h1>

  <p align="center">
    A comprehensive, modern Next.js-based Property Management System tailored for Admins, Landlords, Agents, and Tenants.
    <br />
    <a href="#features"><strong>Explore the features »</strong></a>
    <br />
    <br />
    <a href="#getting-started">Getting Started</a>
    ·
    <a href="#tech-stack">Tech Stack</a>
    ·
    <a href="#role-based-dashboards">Dashboards</a>
  </p>
</div>

---

## 📸 Screenshots

<div align="center">
  <img src="https://placehold.co/800x450/E2E8F0/1E293B/png?text=Landing+Page" alt="Landing Page" width="49%">
  <img src="https://placehold.co/800x450/E2E8F0/1E293B/png?text=Admin+Dashboard" alt="Admin Dashboard" width="49%">
</div>
<br/>
<div align="center">
  <img src="https://placehold.co/800x450/E2E8F0/1E293B/png?text=Tenant+Portal" alt="Tenant Portal" width="49%">
  <img src="https://placehold.co/800x450/E2E8F0/1E293B/png?text=Financial+Analytics" alt="Financial Analytics" width="49%">
</div>

*(Note: Replace placeholder images above with actual screenshots of your running application inside the `public/` directory.)*

## ✨ Features

- **Multi-tenant Role Support**: Dedicated experiences and dashboards for Admins, Landlords, Agents, and Tenants.
- **Automated Billing & Invoicing**: Automated monthly rent generation and invoicing using background Cron Jobs.
- **Payment Gateway Integration**: Seamless rent and fee payments via **Paystack**.
- **Financial Analytics & Reporting**: Real-time revenue charts calculating Monthly Recurring Revenue (MRR) and trailing earnings.
- **Property Management**: Advanced creation, assignment, and tracking of properties with image upload support.
- **Maintenance Requests**: Tenants can create and track maintenance requests directly from their portal.
- **Dark & Light Mode**: A beautifully styled, modern user interface fully supporting theme toggling.
- **Responsive Navigation**: Mobile-friendly sidebar layouts mimicking premium SAAS applications.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Directory)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) & [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (Role-based access control)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Payments**: React Paystack
- **Charts/Analytics**: Recharts

## 📊 Role-Based Dashboards

### 👨‍💼 Admin

Admins have full oversight of the platform. Capabilities include tracking all users, assigning properties to landlords, responding to platform-wide metrics, adjusting system settings, and overseeing global financials.

### 🏢 Landlord

Landlords have their own secure portal to monitor their specific properties. They can track their tenant lifecycle, calculate earnings, manage their property portolios, and view tailored financial analytics regarding their own properties.

### 🕵️‍♂️ Agent

Agents have a streamlined layout designed to help them efficiently list new properties, edit existing listings, and answer booking queries. Theme toggles ensure reading comfort during work hours.

### 👤 Tenant

Tenants use their portal to seamlessly pay upcoming invoices, view property details, generate maintenance requests when systems fail, and track the status of those requests until completion.

## 🛠️ Getting Started

First, ensure you have **Node.js** (v18+) and **PostgreSQL** installed. 

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/Hassan1910/IBSA-HOMES.git
cd ibsa-pms
pnpm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory and add the following keys. Refer to `.env.example` if available.

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ibsa_pms"
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
PAYSTACK_PUBLIC_KEY="pk_test_..."
PAYSTACK_SECRET_KEY="sk_test_..."
```

### 3. Setup Database

Run Prisma migrations to instantiate the schema and seed your initial admin user.

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the live application.

## 📂 Project Structure

```text
├── prisma/             # Database schema and seed scripts
├── src/                
│   ├── actions/        # Server Actions covering various Next.js endpoints
│   ├── app/            # Next.js App Router (Pages, Layouts, API Routes)
│   │   ├── (public)/   # Public facing pages (Home, About, Contact, Login)
│   │   ├── admin/      # Admin portal
│   │   ├── landlord/   # Landlord portal
│   │   ├── agent/      # Agent portal
│   │   ├── tenant/     # Tenant portal
│   │   └── api/        # API endpoints and Webhooks
│   ├── components/     # Reusable React components & Shadcn UI
│   ├── hooks/          # Custom React hooks
│   └── lib/            # Utility functions and Prisma client setup
├── public/             # Static assets (images, icons)
├── README.md           # Project documentation
└── package.json        # Dependencies and scripts
```

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---
<div align="center">
Built with ❤️ by <a href="https://github.com/Hassan1910">Hassan</a>
</div>
