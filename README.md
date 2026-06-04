# FinPay  <img width="22" height="25" alt="finpay-logo" src="https://github.com/user-attachments/assets/7a7d0f20-1218-4f44-9b3b-8e9c64c99afc" />


<img width="936" height="744" alt="731495a8-297b-4b16-bbfc-c1305ea5cfbc copy" src="https://github.com/user-attachments/assets/fa4e7240-36de-4781-bb7e-c3872b4a2cbd" />
<br/>
<br/>
<br/>
FinPay is a full-stack payment application built with a Turborepo setup. It supports user authentication, email verification, user discovery, payment accepting status, and transaction handling with a PostgreSQL database.

## LIVE LINK & DEMO :

Please find the live link of the project below:

* Live Link: `ADD_LIVE_LINK_HERE`

In case the above link is not working, please find the demo of the application attached below:

* Demo Video: `ADD_DEMO_LINK_HERE`

## Tech stack used :

* TypeScript for backend
* React for frontend
* Express.js for backend API
* PostgreSQL for database
* Prisma ORM for database access
* Docker and Docker Compose for containerized setup
* Turborepo for monorepo management
* Nginx for serving the production frontend build

## Snapshots of the application :

<img width="1677" height="926" alt="Screenshot 2026-06-04 at 9 58 20 PM" src="https://github.com/user-attachments/assets/e8927df8-4f2e-4a9a-97c1-b60cb1d67fb0" />
<img width="1661" height="915" alt="Screenshot 2026-06-04 at 9 58 03 PM" src="https://github.com/user-attachments/assets/7fb6dd4b-bfff-4f53-8bda-e65a78237f55" />
<img width="1667" height="915" alt="Screenshot 2026-06-04 at 9 57 55 PM" src="https://github.com/user-attachments/assets/96a58f98-9526-44bf-8138-c9e7e3e4cf08" />
<img width="1668" height="915" alt="Screenshot 2026-06-04 at 9 56 19 PM" src="https://github.com/user-attachments/assets/c6acf1f1-3a32-476f-9a2c-af122114f982" />


<img width="1655" height="917" alt="Screenshot 2026-06-04 at 9 53 36 PM" src="https://github.com/user-attachments/assets/83403f9c-7033-41dd-9145-765ca6520f1f" />






## installation and running the application.

### Option 1 : Dockerized version

Create a `.env.docker` file in the same folder as `docker-compose.yml`.

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/finpay_db
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
JWT_SECRET=your_random_secret
```

Run the application:

```bash
docker compose up
```

Frontend runs at:

```txt
http://localhost:5173
```

Backend runs at:

```txt
http://localhost:3000
```

Docker images used:

```txt<img width="549" height="559" alt="finpay-logo" src="https://github.com/user-attachments/assets/bfcdf373-260b-463e-bf67-bf8353911d26" />

postgres:16-alpine
```

### Option 2 : Clone and run locally

Clone the repository:

```bash
git clone ADD_REPOSITORY_LINK_HERE
cd finpay-v1.0
```

Install dependencies:

```bash
npm install
```

Create required environment files with your own credentials.

Run database migrations:

```bash
cd packages/db
npx prisma migrate dev
```

Run the application:

```bash
npm run dev
```

## .env.example exists?

Yes, `.env.example` exists to show the required environment variables.

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/finpay_db
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
JWT_SECRET=your_random_secret
```

## Tests

Tests are not integrated yet.

Current validation:

* TypeScript build check
* Prisma schema generation
* Docker image build
* Manual API testing through the frontend

Test setup can be added later for:

* Backend route tests
* Auth middleware tests
* Prisma transaction tests
* Frontend component tests

## Architecture Diagram 


<img width="1181" height="688" alt="Screenshot 2026-06-04 at 10 01 48 PM" src="https://github.com/user-attachments/assets/dd48124f-3049-4556-8726-b2f5fb172a5e" />




## Architectural Design Record (ADR) :

Please find the ADRs for the FinPay project below:

* ADR 001: Turborepo structure for frontend, backend, and shared packages
* ADR 002: PostgreSQL with Prisma for relational payment data
* ADR 003: Docker Compose for local production-like setup
* ADR 004: Separate frontend and backend Docker images
* ADR 005: Environment variables injected at runtime through `.env.docker`

ADR files can be added inside:

```txt
docs/adr/
```

## TradeOffs evaluation :

* The frontend and backend are shipped as separate Docker images instead of one combined image.
* This keeps each service clear and independently buildable.
* PostgreSQL runs as a separate container using the official Postgres image.
* Secrets are not baked into Docker images; users provide them through `.env.docker`.
* Prisma migrations must be available and applied to create database tables before using auth/payment flows.
* Docker Compose is used for simple local running instead of Kubernetes or cloud deployment.

## Limitations for the project :

* Email verification requires valid email credentials from the user or deployer.
* The local Docker setup depends on `.env.docker` being configured correctly.
* Payment flow is application-level and does not integrate a real banking/payment gateway yet.
* Tests are not fully integrated yet.
* Production deployment setup is not included yet.
* Database backup, rate limiting, logging, and monitoring are not fully implemented yet.
