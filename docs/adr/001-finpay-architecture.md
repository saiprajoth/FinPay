# ADR 001: FinPay Architecture and Containerization

## Status

Accepted

## Context

FinPay is a full-stack payment application built inside a Turborepo.

The project contains:

```txt
apps/backend
apps/frontend
packages/db
packages/schemas
```

The application needs:

* A React frontend
* An Express backend
* A PostgreSQL database
* Prisma ORM
* Email verification using user-provided email credentials
* Dockerized local running
* Docker images that can be pushed to Docker Hub

The project should not store secrets inside source code or Docker images.

## Decision

FinPay will use a separated service architecture:

```txt
frontend container
backend container
postgres container
```

The frontend and backend will be built as separate Docker images.

```txt
saiprajoth/finpay-frontend:latest
saiprajoth/finpay-backend:latest
postgres:16-alpine
```

Docker Compose will be used to run all services together.

The backend will receive runtime environment variables through `.env.docker`.

Secrets will not be baked into Docker images.

## Why separate frontend and backend images?

The frontend and backend are different runtime services.

The frontend is a static React/Vite build served through Nginx.

The backend is a Node.js/Express API server.

Keeping them separate makes the setup cleaner, easier to debug, and closer to production service boundaries.

## Environment Variables

The backend requires:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/finpay_db
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
JWT_SECRET=your_random_secret
```

These values are provided through:

```txt
.env.docker
```

The `.env.docker` file is created by the user beside `docker-compose.yml`.

The repository should only include:

```txt
.env.example
```

The repository should not include:

```txt
.env
.env.docker
real email password
real database password
real JWT secret
```

## Database Decision

PostgreSQL is used because FinPay has relational data:

* Users
* Transactions
* Sender and recipient relationships
* Verification fields
* Payment accepting status

Prisma is used as the ORM.

Prisma migrations are required so Docker Postgres can create the required tables.

The backend startup command runs migration deployment before starting the server.

```bash
npx prisma migrate deploy
```

## Docker Compose Decision

Docker Compose is used because the project needs multiple services to run together:

```txt
frontend
backend
postgres
```

The user can run the full project with:

```bash
docker compose up
```

## Docker Image Decision

The Docker images should contain application code and built output only.

They should not contain user credentials.

The images can be pushed to Docker Hub:

```bash
docker build -f apps/backend/Dockerfile -t saiprajoth/finpay-backend:latest .
docker build -f apps/frontend/Dockerfile -t saiprajoth/finpay-frontend:latest .

docker push saiprajoth/finpay-backend:latest
docker push saiprajoth/finpay-frontend:latest
```

## Consequences

### Benefits

* Clear separation between frontend, backend, and database
* No secrets inside Docker images
* Works with Docker Compose
* Easier to push frontend and backend images separately
* PostgreSQL data persists through Docker volume
* User can configure their own email credentials

### Tradeoffs

* Two app images are required instead of one
* User must create `.env.docker`
* Prisma migrations must exist and be committed
* Docker Compose file is required to run the full system

## Final Runtime Shape

```txt
Browser
  ↓
Frontend container: Nginx serving React build
  ↓
Backend container: Express API
  ↓
Postgres container: database
```

## Final Decision

FinPay will use:

* Turborepo for monorepo structure
* React/Vite for frontend
* Express/Node.js for backend
* PostgreSQL for database
* Prisma for ORM and migrations
* Dockerfiles for backend and frontend images
* Docker Compose for running frontend, backend, and Postgres together
* `.env.docker` for runtime secrets
