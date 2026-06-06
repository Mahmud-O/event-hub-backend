# Event Hub Backend Generation Instructions

You are an expert backend engineer specializing in Node.js, NestJS, MongoDB (Mongoose), and TypeScript. Your task is to generate the backend codebase for an application called **Event Hub**.

## Project Context
- **Figma Design Reference:** [INSERT FIGMA LINK HERE]
- **Framework:** NestJS (Express under the hood)
- **Database:** MongoDB with Mongoose ODM
- **Language:** TypeScript
- **Architecture:** Modular, domain-driven design

## 1. Folder Structure
Strictly adhere to the following directory structure when generating code:
`src/modules/` should contain `auth`, `users`, `categories`, `events`, and `bookings`.
Each module must have its own `dto/` folder, `schemas/` folder (except Auth), `[module].controller.ts`, `[module].service.ts`, and `[module].module.ts`.

## 2. Core Constraints & Best Practices
- **Mongoose Schemas:** Define schemas using `@nestjs/mongoose` decorators (`@Schema()`, `@Prop()`, `SchemaFactory.createForClass()`).
- **Validation:** Use `class-validator` and `class-transformer` inside the `dto/` folders for all incoming request bodies. Enable NestJS `ValidationPipe` globally.
- **Authentication:** Implement JWT authentication using `@nestjs/passport`. Secure all endpoints except `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/categories`, `GET /api/events`, and `GET /api/events/:id`.
- **References:** Properly utilize Mongoose `ObjectId` references between collections (e.g., Bookings referencing User and Event, Events referencing Category).
- **Error Handling:** Use standard NestJS built-in HTTP Exceptions (e.g., `NotFoundException`, `ConflictException`, `UnauthorizedException`).

## 3. Database Schema Requirements
Generate the following Mongoose schemas:

* **User Schema:** Store authentication credentials, user role (e.g., 'User', 'Organizer', 'Admin'), and profile information.
* **Category Schema:** Store category details (name, description, icon).
* **Event Schema:** Store event details (title, description, date, location, `categoryId` reference, `organizerId` reference, price, capacity).
* **Booking Schema:** Store booking details (`userId` reference, `eventId` reference, ticket quantity, selected extras, total price, status ['Pending', 'Confirmed', 'Cancelled']).

## 4. API Endpoints to Implement

### Authentication (`src/modules/auth`)
* `POST /api/auth/register` - Create a new user account.
* `POST /api/auth/login` - Authenticate and return a JWT token.

### Categories (`src/modules/categories`)
* `GET /api/categories` - Retrieve a list of all event categories.
* `POST /api/categories` - Create a new category (Admin only).

### Events (`src/modules/events`)
* `GET /api/events` - Retrieve events. Support query filters (e.g., `?categoryId=123`, `?date=2024-05-10`).
* `GET /api/events/:id` - Retrieve detailed information for a specific event.
* `POST /api/events` - Create a new event (Organizer/Admin only).
* `PUT /api/events/:id` - Update event details (Organizer/Admin only).
* `DELETE /api/events/:id` - Cancel/delete an event (Organizer/Admin only).

### Bookings (`src/modules/bookings`)
* `POST /api/bookings` - Create a new booking for an event. Must include logic to calculate total price based on event price, quantity, and selected extras.
* `GET /api/bookings/user/:userId` - Retrieve all bookings for a specific user.
* `GET /api/bookings/:id` - Retrieve details for a specific booking.
* `PATCH /api/bookings/:id/status` - Update booking status (e.g., to 'Confirmed' after payment, or 'Cancelled').

## Execution Task
Please generate the complete, runnable code for these modules step-by-step. Start by generating the `app.module.ts`, Mongoose database configuration, and the **User** and **Auth** modules. Wait for my confirmation before proceeding to Categories, Events, and Bookings.