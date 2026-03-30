--
-- PostgreSQL database dump
--

\restrict 1WuZlfjCM9E4aSAGLdUE0K6T3IKY6o7QZuheR5bBfZiS3QgwrTGUAGkX2pkAFUq

-- Dumped from database version 18.2
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: hassan
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO hassan;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: hassan
--

COMMENT ON SCHEMA public IS '';


--
-- Name: PropertyPurpose; Type: TYPE; Schema: public; Owner: hassan
--

CREATE TYPE public."PropertyPurpose" AS ENUM (
    'RENT',
    'SALE'
);


ALTER TYPE public."PropertyPurpose" OWNER TO hassan;

--
-- Name: PropertyType; Type: TYPE; Schema: public; Owner: hassan
--

CREATE TYPE public."PropertyType" AS ENUM (
    'APARTMENT',
    'HOUSE',
    'OFFICE',
    'LAND'
);


ALTER TYPE public."PropertyType" OWNER TO hassan;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: hassan
--

CREATE TYPE public."UserRole" AS ENUM (
    'ADMIN',
    'AGENT',
    'TENANT',
    'LANDLORD',
    'BOOKING_OFFICER'
);


ALTER TYPE public."UserRole" OWNER TO hassan;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Booking; Type: TABLE; Schema: public; Owner: hassan
--

CREATE TABLE public."Booking" (
    id text NOT NULL,
    "organizationId" text NOT NULL,
    "propertyId" text NOT NULL,
    "userId" text,
    "visitorName" text,
    "visitorContact" text,
    date timestamp(3) without time zone NOT NULL,
    status text DEFAULT 'PENDING'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Booking" OWNER TO hassan;

--
-- Name: InventoryItem; Type: TABLE; Schema: public; Owner: hassan
--

CREATE TABLE public."InventoryItem" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    category text NOT NULL,
    quantity integer DEFAULT 0 NOT NULL,
    "unitCost" numeric(65,30),
    "lowStockThreshold" integer DEFAULT 5 NOT NULL,
    "organizationId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."InventoryItem" OWNER TO hassan;

--
-- Name: MaintenanceRequest; Type: TABLE; Schema: public; Owner: hassan
--

CREATE TABLE public."MaintenanceRequest" (
    id text NOT NULL,
    description text NOT NULL,
    status text DEFAULT 'OPEN'::text NOT NULL,
    cost numeric(65,30),
    "organizationId" text NOT NULL,
    "propertyId" text NOT NULL,
    "reporterId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isReadByAgent" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."MaintenanceRequest" OWNER TO hassan;

--
-- Name: Organization; Type: TABLE; Schema: public; Owner: hassan
--

CREATE TABLE public."Organization" (
    id text NOT NULL,
    name text NOT NULL,
    "subscriptionStatus" text DEFAULT 'TRIAL'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "paystackCustomerCode" text
);


ALTER TABLE public."Organization" OWNER TO hassan;

--
-- Name: Payment; Type: TABLE; Schema: public; Owner: hassan
--

CREATE TABLE public."Payment" (
    id text NOT NULL,
    amount numeric(65,30) NOT NULL,
    date timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    type text NOT NULL,
    status text DEFAULT 'COMPLETED'::text NOT NULL,
    "organizationId" text NOT NULL,
    "tenantId" text NOT NULL,
    gateway text DEFAULT 'PAYSTACK'::text NOT NULL,
    reference text
);


ALTER TABLE public."Payment" OWNER TO hassan;

--
-- Name: Property; Type: TABLE; Schema: public; Owner: hassan
--

CREATE TABLE public."Property" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    address text NOT NULL,
    price numeric(65,30) NOT NULL,
    status text DEFAULT 'AVAILABLE'::text NOT NULL,
    bedrooms integer DEFAULT 0 NOT NULL,
    bathrooms integer DEFAULT 0 NOT NULL,
    area double precision,
    images text[],
    "organizationId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "agentId" text,
    "ownerId" text,
    purpose public."PropertyPurpose" DEFAULT 'RENT'::public."PropertyPurpose" NOT NULL,
    type public."PropertyType" DEFAULT 'APARTMENT'::public."PropertyType" NOT NULL
);


ALTER TABLE public."Property" OWNER TO hassan;

--
-- Name: SupportTicket; Type: TABLE; Schema: public; Owner: hassan
--

CREATE TABLE public."SupportTicket" (
    id text NOT NULL,
    subject text NOT NULL,
    category text NOT NULL,
    description text NOT NULL,
    status text DEFAULT 'OPEN'::text NOT NULL,
    "organizationId" text NOT NULL,
    "reporterId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isReadByAgent" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."SupportTicket" OWNER TO hassan;

--
-- Name: SystemSettings; Type: TABLE; Schema: public; Owner: hassan
--

CREATE TABLE public."SystemSettings" (
    id text NOT NULL,
    "companyName" text DEFAULT 'IBSA Homes'::text NOT NULL,
    "supportEmail" text,
    "supportPhone" text,
    currency text DEFAULT 'USD'::text NOT NULL,
    "organizationId" text NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."SystemSettings" OWNER TO hassan;

--
-- Name: TenantProfile; Type: TABLE; Schema: public; Owner: hassan
--

CREATE TABLE public."TenantProfile" (
    id text NOT NULL,
    "userId" text NOT NULL,
    phone text,
    "leaseStartDate" timestamp(3) without time zone,
    "leaseEndDate" timestamp(3) without time zone,
    "organizationId" text NOT NULL,
    "propertyId" text,
    "agentId" text
);


ALTER TABLE public."TenantProfile" OWNER TO hassan;

--
-- Name: User; Type: TABLE; Schema: public; Owner: hassan
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    name text,
    role public."UserRole" DEFAULT 'TENANT'::public."UserRole" NOT NULL,
    "organizationId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO hassan;

--
-- Data for Name: Booking; Type: TABLE DATA; Schema: public; Owner: hassan
--

COPY public."Booking" (id, "organizationId", "propertyId", "userId", "visitorName", "visitorContact", date, status, "createdAt") FROM stdin;
\.


--
-- Data for Name: InventoryItem; Type: TABLE DATA; Schema: public; Owner: hassan
--

COPY public."InventoryItem" (id, name, description, category, quantity, "unitCost", "lowStockThreshold", "organizationId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: MaintenanceRequest; Type: TABLE DATA; Schema: public; Owner: hassan
--

COPY public."MaintenanceRequest" (id, description, status, cost, "organizationId", "propertyId", "reporterId", "createdAt", "updatedAt", "isReadByAgent") FROM stdin;
be2e3609-8217-4ffd-b989-ad57a7738faf	test	RESOLVED	\N	edf2f984-07ac-4f7e-955f-dfe1fb190c3d	40fef43b-0f8e-48f7-8ddf-a92ac4a9f71d	e0ff5e84-cc00-4536-8d36-6d45491cbea3	2026-02-25 10:18:29.189	2026-02-25 10:53:50.379	t
b451ea66-cecd-4a41-a4f7-ebdbee55b5fc	test2	RESOLVED	\N	edf2f984-07ac-4f7e-955f-dfe1fb190c3d	40fef43b-0f8e-48f7-8ddf-a92ac4a9f71d	e0ff5e84-cc00-4536-8d36-6d45491cbea3	2026-02-25 10:55:08.601	2026-02-25 13:28:24.083	t
\.


--
-- Data for Name: Organization; Type: TABLE DATA; Schema: public; Owner: hassan
--

COPY public."Organization" (id, name, "subscriptionStatus", "createdAt", "updatedAt", "paystackCustomerCode") FROM stdin;
edf2f984-07ac-4f7e-955f-dfe1fb190c3d	Default Agency	TRIAL	2026-02-20 12:28:15.238	2026-02-20 12:28:15.238	\N
\.


--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: hassan
--

COPY public."Payment" (id, amount, date, type, status, "organizationId", "tenantId", gateway, reference) FROM stdin;
cc9fa1e4-8c59-4975-bf6e-1badf55f3075	200.000000000000000000000000000000	2026-02-20 21:34:48.889	RENT	COMPLETED	edf2f984-07ac-4f7e-955f-dfe1fb190c3d	3c8bd43a-b792-4f0e-b463-b0a71f3c225e	PAYSTACK	PAY_1646550D10EBE77C
19bd6302-ce02-4995-87d6-49cbc827c0be	20000.000000000000000000000000000000	2026-02-20 19:42:23.407	RENT	COMPLETED	edf2f984-07ac-4f7e-955f-dfe1fb190c3d	3c8bd43a-b792-4f0e-b463-b0a71f3c225e	PAYSTACK	PAY_0DC8CD7D27857330
ee3a5de1-e621-42bf-9c2e-07c8f5091432	500.000000000000000000000000000000	2026-02-25 11:12:33.89	FEE	COMPLETED	edf2f984-07ac-4f7e-955f-dfe1fb190c3d	3c8bd43a-b792-4f0e-b463-b0a71f3c225e	PAYSTACK	PAY_F1E8268894BDB8AE
e163103e-33df-4cd6-aa0b-fdf95e79c85d	1000.000000000000000000000000000000	2026-02-25 11:18:11.277	DEPOSIT	COMPLETED	edf2f984-07ac-4f7e-955f-dfe1fb190c3d	3c8bd43a-b792-4f0e-b463-b0a71f3c225e	PAYSTACK	PAY_4D2FE29A676F85FA
1a1840c8-8579-4d0d-b74b-734755c65795	2500.000000000000000000000000000000	2026-02-25 11:25:12.153	RENT	COMPLETED	edf2f984-07ac-4f7e-955f-dfe1fb190c3d	3c8bd43a-b792-4f0e-b463-b0a71f3c225e	PAYSTACK	PAY_7F15C9DE711BD081
20c6e145-5b6a-40d7-86f9-cfebd0ecfb18	2000.000000000000000000000000000000	2026-02-25 11:31:38.038	RENT	COMPLETED	edf2f984-07ac-4f7e-955f-dfe1fb190c3d	3c8bd43a-b792-4f0e-b463-b0a71f3c225e	PAYSTACK	PAY_E8E023D0A2BE236A
a13aa8da-7fc0-458a-a46f-17683c2742ea	155.000000000000000000000000000000	2026-02-25 11:26:21.939	FEE	COMPLETED	edf2f984-07ac-4f7e-955f-dfe1fb190c3d	3c8bd43a-b792-4f0e-b463-b0a71f3c225e	PAYSTACK	PAY_10E1D7BD9142EEC2
46671e74-0ef1-4aba-bead-33af57ca992e	2500.000000000000000000000000000000	2026-02-25 14:17:41.35	RENT	COMPLETED	edf2f984-07ac-4f7e-955f-dfe1fb190c3d	93126726-7ae4-4230-bec0-1b8b51451b19	PAYSTACK	PAY_912E9324BFCDA55A
20ccf29d-b8f3-4794-a874-b44bb88bcca2	2000.000000000000000000000000000000	2026-02-25 14:09:50.947	RENT	COMPLETED	edf2f984-07ac-4f7e-955f-dfe1fb190c3d	93126726-7ae4-4230-bec0-1b8b51451b19	PAYSTACK	PAY_98256EDA80D0D84B
\.


--
-- Data for Name: Property; Type: TABLE DATA; Schema: public; Owner: hassan
--

COPY public."Property" (id, title, description, address, price, status, bedrooms, bathrooms, area, images, "organizationId", "createdAt", "updatedAt", "agentId", "ownerId", purpose, type) FROM stdin;
24248770-142c-498e-8b09-7e7f1683a92d	Sunny Beachfront Condo	Wake up to the sound of waves in this beautiful beachfront condo. Direct access to the beach and a shared pool.	220 Ocean Blvd, Seaside	4500.000000000000000000000000000000	AVAILABLE	3	2	1600	{https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80,https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80,https://images.unsplash.com/photo-1522771731478-44fb9fba11ac?w=1200&q=80}	edf2f984-07ac-4f7e-955f-dfe1fb190c3d	2026-02-20 20:33:25.117	2026-02-20 20:33:25.117	\N	\N	RENT	APARTMENT
01ba6b2e-c1d0-4b6f-adfd-57388d512ba3	Modern Tech Hub Studio	Compact but brilliantly designed studio apartment right next to the major tech campuses.	555 Silicon Way, Techville	1800.000000000000000000000000000000	AVAILABLE	1	1	600	{https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200&q=80,https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80,https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80}	edf2f984-07ac-4f7e-955f-dfe1fb190c3d	2026-02-20 20:33:25.128	2026-02-20 20:33:25.128	\N	\N	RENT	APARTMENT
a2356fd6-e55d-42dc-871d-7e56a79cfcbb	Sleek Urban Loft	Minimalist industrial loft with exposed brick walls, high ceilings, and huge windows letting in natural light.	101 Industrial Way, Warehouse District	2800.000000000000000000000000000000	AVAILABLE	1	1	1100	{https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80,https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80,https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80}	edf2f984-07ac-4f7e-955f-dfe1fb190c3d	2026-02-20 20:33:25.107	2026-02-20 20:37:44.164	\N	\N	RENT	APARTMENT
3caf768c-9acb-45c2-b32b-80905eedc595	Sunset Valley - 3 Bedroom Unit 1	Spacious 3-bedroom apartment with a beautiful view.	Sunset Valley Complex, Unit 1	45000.000000000000000000000000000000	AVAILABLE	3	2	120.5	{https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800,https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800}	edf2f984-07ac-4f7e-955f-dfe1fb190c3d	2026-02-24 15:12:11.304	2026-02-24 15:12:11.304	\N	\N	RENT	APARTMENT
a85d7f8c-32bd-47ef-9af6-dbed4c8d9e7b	Sunset Valley - 3 Bedroom Unit 2	Modern 3-bedroom apartment perfect for a family.	Sunset Valley Complex, Unit 2	45000.000000000000000000000000000000	AVAILABLE	3	2	120.5	{https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800}	edf2f984-07ac-4f7e-955f-dfe1fb190c3d	2026-02-24 15:12:11.324	2026-02-24 15:12:11.324	\N	\N	RENT	APARTMENT
0bc56aa5-8fbf-47c8-a470-13966cfc642d	Sunset Valley - 2 Bedroom Unit 1	Cozy 2-bedroom apartment with great amenities.	Sunset Valley Complex, Unit 3	35000.000000000000000000000000000000	AVAILABLE	2	1	85	{https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800}	edf2f984-07ac-4f7e-955f-dfe1fb190c3d	2026-02-24 15:12:11.341	2026-02-24 15:12:11.341	\N	\N	RENT	APARTMENT
df57250c-a4d0-4ed1-80d2-cfe21018efbe	Sunset Valley - Bedsitter 5	A convenient bedsitter unit.	Sunset Valley Complex, Unit 5	15000.000000000000000000000000000000	AVAILABLE	0	1	30	{https://images.unsplash.com/photo-1536376072261-38c75010e6c9?q=80&w=800}	edf2f984-07ac-4f7e-955f-dfe1fb190c3d	2026-02-24 15:12:11.366	2026-02-24 15:12:11.366	\N	\N	RENT	APARTMENT
1e0b3ed0-e5f4-480f-8e92-4549bb97e3fa	Luxury Hillside Villa	Stunning luxury villa featuring a private pool, extensive garden, and panoramic views of the hills.	456 Highland Drive, Beverly Hills	8500.000000000000000000000000000000	AVAILABLE	5	4	4500	{https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80,https://images.unsplash.com/photo-1600607687983-bc2a297a7ea6?w=1200&q=80,https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80}	edf2f984-07ac-4f7e-955f-dfe1fb190c3d	2026-02-20 20:33:25.082	2026-02-25 13:37:25.322	\N	4fb0ea1f-a79f-46e9-9f51-5f64da1b1bd6	RENT	APARTMENT
897e3b2c-e450-4022-a2fa-dca55cf17716	Cozy Suburban Family Home	Perfect family home in a quiet neighborhood. Features a large backyard and newly renovated kitchen.	789 Maple Ave, Springfield	3200.000000000000000000000000000000	AVAILABLE	4	2	2800	{https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&q=80,https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1200&q=80,https://images.unsplash.com/photo-1502005229762-cf1b2e1c6b46?w=1200&q=80}	edf2f984-07ac-4f7e-955f-dfe1fb190c3d	2026-02-20 20:33:25.096	2026-02-25 13:38:32.106	5b3bad26-b299-417a-a91a-00b85608b41a	4fb0ea1f-a79f-46e9-9f51-5f64da1b1bd6	RENT	APARTMENT
40fef43b-0f8e-48f7-8ddf-a92ac4a9f71d	Modern Downtown Apartment	A beautiful modern apartment in the heart of the city with amazing city views. Comes fully furnished with premium appliances.	123 Main St, Cityville	2500.000000000000000000000000000000	AVAILABLE	2	2	1200	{https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80,https://images.unsplash.com/photo-1502672260266-1c1de2d93688?w=1200&q=80,https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200&q=80}	edf2f984-07ac-4f7e-955f-dfe1fb190c3d	2026-02-20 20:33:25.07	2026-02-25 13:45:40.399	5b3bad26-b299-417a-a91a-00b85608b41a	4fb0ea1f-a79f-46e9-9f51-5f64da1b1bd6	RENT	APARTMENT
\.


--
-- Data for Name: SupportTicket; Type: TABLE DATA; Schema: public; Owner: hassan
--

COPY public."SupportTicket" (id, subject, category, description, status, "organizationId", "reporterId", "createdAt", "updatedAt", "isReadByAgent") FROM stdin;
810f24a0-14c1-48fb-a325-b8739ded87e8	test	SUGGESTION	test	CLOSED	edf2f984-07ac-4f7e-955f-dfe1fb190c3d	e0ff5e84-cc00-4536-8d36-6d45491cbea3	2026-02-25 10:54:51.971	2026-02-25 11:11:58.682	t
\.


--
-- Data for Name: SystemSettings; Type: TABLE DATA; Schema: public; Owner: hassan
--

COPY public."SystemSettings" (id, "companyName", "supportEmail", "supportPhone", currency, "organizationId", "updatedAt") FROM stdin;
a5c3c510-a58e-4b64-9eae-a421bd275fbf	IBSA Homes	\N	\N	KES	edf2f984-07ac-4f7e-955f-dfe1fb190c3d	2026-02-20 14:42:17.531
\.


--
-- Data for Name: TenantProfile; Type: TABLE DATA; Schema: public; Owner: hassan
--

COPY public."TenantProfile" (id, "userId", phone, "leaseStartDate", "leaseEndDate", "organizationId", "propertyId", "agentId") FROM stdin;
3c8bd43a-b792-4f0e-b463-b0a71f3c225e	e0ff5e84-cc00-4536-8d36-6d45491cbea3		2026-01-25 00:00:00	\N	edf2f984-07ac-4f7e-955f-dfe1fb190c3d	40fef43b-0f8e-48f7-8ddf-a92ac4a9f71d	5b3bad26-b299-417a-a91a-00b85608b41a
93126726-7ae4-4230-bec0-1b8b51451b19	f9ba4315-37ad-4fc2-8f8b-a8ccdd277b45	0756478324	2026-02-25 00:00:00	\N	edf2f984-07ac-4f7e-955f-dfe1fb190c3d	40fef43b-0f8e-48f7-8ddf-a92ac4a9f71d	\N
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: hassan
--

COPY public."User" (id, email, password, name, role, "organizationId", "createdAt", "updatedAt") FROM stdin;
256e5619-e285-45f6-ad76-f929ce126ac8	agent@ibsahomes.com	$2b$10$WGOlZVTFeB08Ub5QnD53guLkErBtpvaiWsktC5OUi21qPVFDUu1vC	Test Agent	AGENT	edf2f984-07ac-4f7e-955f-dfe1fb190c3d	2026-02-20 12:28:29.607	2026-02-20 12:28:29.607
4fb0ea1f-a79f-46e9-9f51-5f64da1b1bd6	adan@gmail.com	$2b$10$eeEHklKJdeQXVUrdyAeAC.1zSj2jsc2/dhwEnKeRhGBQxmJd1Z5Se	Hassan Adan	LANDLORD	edf2f984-07ac-4f7e-955f-dfe1fb190c3d	2026-02-20 19:26:06.082	2026-02-20 19:26:06.082
5b3bad26-b299-417a-a91a-00b85608b41a	wako@gmail.com	$2b$10$1JPsLbo.VlsvgRwPNIs8MO5Ils44ZuWKVZmG8WKfhxFODDMDrEkD2	wako adan	AGENT	edf2f984-07ac-4f7e-955f-dfe1fb190c3d	2026-02-20 20:03:02.981	2026-02-20 20:03:02.981
d4c39199-61e0-4b5a-baa9-4899c8a60be3	admin@ibsahomes.com	$2b$10$R6E1nHGW228dZBizRVz3U.IxGRvjWrgFt7EjvY6NOIuzdLa83cvYq	Liban	ADMIN	edf2f984-07ac-4f7e-955f-dfe1fb190c3d	2026-02-20 12:28:15.452	2026-02-24 16:17:13.434
e0ff5e84-cc00-4536-8d36-6d45491cbea3	hassan@gmail.com	$2b$10$9JwMuX0jtM2pdUCak/lZJOcjHO/x3bDtz93oJc0n1uPOVXlFKpdoa	adan hasssan	TENANT	edf2f984-07ac-4f7e-955f-dfe1fb190c3d	2026-02-20 19:33:59.066	2026-02-25 10:15:07.716
f9ba4315-37ad-4fc2-8f8b-a8ccdd277b45	test1@gmai.com	$2b$10$tukfGxRymjWaIpBtIxVdN.P.wdzAD29VHEdFQm.cYiFlYGlujk0hO	test1	TENANT	edf2f984-07ac-4f7e-955f-dfe1fb190c3d	2026-02-25 13:29:48.95	2026-02-25 13:29:48.95
\.


--
-- Name: Booking Booking_pkey; Type: CONSTRAINT; Schema: public; Owner: hassan
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_pkey" PRIMARY KEY (id);


--
-- Name: InventoryItem InventoryItem_pkey; Type: CONSTRAINT; Schema: public; Owner: hassan
--

ALTER TABLE ONLY public."InventoryItem"
    ADD CONSTRAINT "InventoryItem_pkey" PRIMARY KEY (id);


--
-- Name: MaintenanceRequest MaintenanceRequest_pkey; Type: CONSTRAINT; Schema: public; Owner: hassan
--

ALTER TABLE ONLY public."MaintenanceRequest"
    ADD CONSTRAINT "MaintenanceRequest_pkey" PRIMARY KEY (id);


--
-- Name: Organization Organization_pkey; Type: CONSTRAINT; Schema: public; Owner: hassan
--

ALTER TABLE ONLY public."Organization"
    ADD CONSTRAINT "Organization_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: hassan
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: Property Property_pkey; Type: CONSTRAINT; Schema: public; Owner: hassan
--

ALTER TABLE ONLY public."Property"
    ADD CONSTRAINT "Property_pkey" PRIMARY KEY (id);


--
-- Name: SupportTicket SupportTicket_pkey; Type: CONSTRAINT; Schema: public; Owner: hassan
--

ALTER TABLE ONLY public."SupportTicket"
    ADD CONSTRAINT "SupportTicket_pkey" PRIMARY KEY (id);


--
-- Name: SystemSettings SystemSettings_pkey; Type: CONSTRAINT; Schema: public; Owner: hassan
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_pkey" PRIMARY KEY (id);


--
-- Name: TenantProfile TenantProfile_pkey; Type: CONSTRAINT; Schema: public; Owner: hassan
--

ALTER TABLE ONLY public."TenantProfile"
    ADD CONSTRAINT "TenantProfile_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: hassan
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Organization_paystackCustomerCode_key; Type: INDEX; Schema: public; Owner: hassan
--

CREATE UNIQUE INDEX "Organization_paystackCustomerCode_key" ON public."Organization" USING btree ("paystackCustomerCode");


--
-- Name: Payment_reference_key; Type: INDEX; Schema: public; Owner: hassan
--

CREATE UNIQUE INDEX "Payment_reference_key" ON public."Payment" USING btree (reference);


--
-- Name: SystemSettings_organizationId_key; Type: INDEX; Schema: public; Owner: hassan
--

CREATE UNIQUE INDEX "SystemSettings_organizationId_key" ON public."SystemSettings" USING btree ("organizationId");


--
-- Name: TenantProfile_userId_key; Type: INDEX; Schema: public; Owner: hassan
--

CREATE UNIQUE INDEX "TenantProfile_userId_key" ON public."TenantProfile" USING btree ("userId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: hassan
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Booking Booking_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hassan
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Booking Booking_propertyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hassan
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES public."Property"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Booking Booking_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hassan
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: InventoryItem InventoryItem_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hassan
--

ALTER TABLE ONLY public."InventoryItem"
    ADD CONSTRAINT "InventoryItem_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MaintenanceRequest MaintenanceRequest_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hassan
--

ALTER TABLE ONLY public."MaintenanceRequest"
    ADD CONSTRAINT "MaintenanceRequest_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MaintenanceRequest MaintenanceRequest_propertyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hassan
--

ALTER TABLE ONLY public."MaintenanceRequest"
    ADD CONSTRAINT "MaintenanceRequest_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES public."Property"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: MaintenanceRequest MaintenanceRequest_reporterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hassan
--

ALTER TABLE ONLY public."MaintenanceRequest"
    ADD CONSTRAINT "MaintenanceRequest_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Payment Payment_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hassan
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Payment Payment_tenantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hassan
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES public."TenantProfile"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Property Property_agentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hassan
--

ALTER TABLE ONLY public."Property"
    ADD CONSTRAINT "Property_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Property Property_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hassan
--

ALTER TABLE ONLY public."Property"
    ADD CONSTRAINT "Property_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Property Property_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hassan
--

ALTER TABLE ONLY public."Property"
    ADD CONSTRAINT "Property_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: SupportTicket SupportTicket_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hassan
--

ALTER TABLE ONLY public."SupportTicket"
    ADD CONSTRAINT "SupportTicket_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SupportTicket SupportTicket_reporterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hassan
--

ALTER TABLE ONLY public."SupportTicket"
    ADD CONSTRAINT "SupportTicket_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SystemSettings SystemSettings_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hassan
--

ALTER TABLE ONLY public."SystemSettings"
    ADD CONSTRAINT "SystemSettings_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TenantProfile TenantProfile_agentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hassan
--

ALTER TABLE ONLY public."TenantProfile"
    ADD CONSTRAINT "TenantProfile_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TenantProfile TenantProfile_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hassan
--

ALTER TABLE ONLY public."TenantProfile"
    ADD CONSTRAINT "TenantProfile_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TenantProfile TenantProfile_propertyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hassan
--

ALTER TABLE ONLY public."TenantProfile"
    ADD CONSTRAINT "TenantProfile_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES public."Property"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: TenantProfile TenantProfile_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hassan
--

ALTER TABLE ONLY public."TenantProfile"
    ADD CONSTRAINT "TenantProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: User User_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hassan
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: hassan
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict 1WuZlfjCM9E4aSAGLdUE0K6T3IKY6o7QZuheR5bBfZiS3QgwrTGUAGkX2pkAFUq

