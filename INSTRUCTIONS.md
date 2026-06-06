# Event Hub Backend - Generation & Setup Instructions

This document outlines the architecture, setup requirements, and implementation details for the **Event Hub** backend.

## Project Context
- **Framework:** NestJS (Express under the hood)
- **Database:** MongoDB with Mongoose ODM
- **Language:** TypeScript
- **Architecture:** Modular, domain-driven design

---

## 1. Environment & Configuration Setup

The application depends on the following environment variables. Ensure a `.env` file exists in the root directory with these variables configured:

```env
# Server Port configuration
PORT=3000

# MongoDB Connection String
MONGODB_URI=mongodb://127.0.0.1:27017/event_hub

# JWT Authentication Configuration
JWT_SECRET=super_secret_event_hub_key_change_me_in_production
JWT_EXPIRATION=1d
```

*The database configurations are loaded asynchronously in `app.module.ts` via [database.config.ts](file:///d:/digilians/Projects/Event%20Hub/event-hub-backend/src/config/database.config.ts).*

---

## 2. Docker & Deployment Setup (Railway ready)

The project includes a production-ready Docker configuration:

* **[Dockerfile](file:///d:/digilians/Projects/Event%20Hub/event-hub-backend/Dockerfile):** A multi-stage build. 
  - **Stage 1 (Builder):** Installs all dependencies and compiles the NestJS code (`dist/`).
  - **Stage 2 (Runner):** Installs *only* production dependencies (`npm ci --only=production`) and runs the compiled JavaScript code via Node, exposing port `3000`.
* **[.dockerignore](file:///d:/digilians/Projects/Event%20Hub/event-hub-backend/.dockerignore):** Excludes local dev files (like `.env` and `node_modules`) to keep the build size minimal and prevent security leaks.
* **Binding:** The NestJS application is configured in `main.ts` to listen on host `0.0.0.0` (i.e. `app.listen(port, '0.0.0.0')`) to comply with Railway and container routing.

---

## 3. Core Constraints & Best Practices

- **Mongoose Schemas:** Defined using `@nestjs/mongoose` decorators (`@Schema()`, `@Prop()`, `SchemaFactory.createForClass()`).
- **Dependency Management (Windows Compatibility):** `bcryptjs` is used instead of `bcrypt` to prevent installation/compilation failures on Windows nodes.
- **Validation:** Enforced globally via `ValidationPipe` in `main.ts` with `whitelist: true` and `transform: true`. All input fields are validated in DTOs via `class-validator` and `class-transformer`.
- **Authentication:** JWT authentication using `@nestjs/passport`. 
  - Secured globally via global `JwtAuthGuard` and `RolesGuard` providers in `app.module.ts`.
  - Public endpoints bypass the guard using the custom `@Public()` decorator.
  - Role restrictions are applied using `@Roles('Admin', 'Organizer')` and verified by `RolesGuard`.
- **Error Handling:** Use standard NestJS built-in HTTP Exceptions (e.g. `ConflictException`, `NotFoundException`, `UnauthorizedException`).

---

## 4. Database Schema Requirements

* **User Schema:** Store email, hashed password, role (`'User' | 'Organizer' | 'Admin'`), firstName, lastName, and phoneNumber.
* **Category Schema:** *[Pending Step 2]* Store category details (name, description, icon).
* **Event Schema:** *[Pending Step 2]* Store event details (title, description, date, location, `categoryId` reference, `organizerId` reference, price, capacity).
* **Booking Schema:** *[Pending Step 2]* Store booking details (`userId` reference, `eventId` reference, ticket quantity, selected extras, total price, status ['Pending', 'Confirmed', 'Cancelled']).

---

## 5. API Endpoints

### Authentication (`src/modules/auth`)
* `POST /api/auth/register` - Create a new user account. Returns created user profile (excludes password).
* `POST /api/auth/login` - Authenticate and return JWT token in the format `{ accessToken, user }`.

### Users (`src/modules/users`)
* `GET /api/users/profile` - Retrieve detailed profile info of the currently logged-in user. Requires bearer token.

### Categories (`src/modules/categories`) - *[Pending]*
* `GET /api/categories` - Retrieve a list of all categories (Public).
* `POST /api/categories` - Create a new category (Admin only).

### Events (`src/modules/events`) - *[Pending]*
* `GET /api/events` - Retrieve events with filters (Public).
* `GET /api/events/:id` - Retrieve detailed event information (Public).
* `POST /api/events` - Create a new event (Organizer/Admin only).
* `PUT /api/events/:id` - Update event details (Organizer/Admin only).
* `DELETE /api/events/:id` - Cancel/delete an event (Organizer/Admin only).

### Bookings (`src/modules/bookings`) - *[Pending]*
* `POST /api/bookings` - Create a booking with automated price calculation (User/Organizer/Admin).
* `GET /api/bookings/user/:userId` - Retrieve all bookings for a user.
* `GET /api/bookings/:id` - Retrieve specific booking details.
* `PATCH /api/bookings/:id/status` - Update booking status (Organizer/Admin only).