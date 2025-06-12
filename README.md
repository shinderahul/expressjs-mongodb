# Express.js MongoDB JWT Authentication

A complete authentication system built with Express.js, MongoDB, and JWT tokens.

## Features

- User registration and login
- JWT token authentication
- Password hashing with bcryptjs
- Protected routes middleware
- Role-based access control
- MongoDB integration with Mongoose
- CRUD Operation
- Rate Limiting
- TypeScript

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure
4. Start MongoDB
5. Run the application: `npm run dev`

## Auth API Endpoints

- POST `/auth/register` - Register user
- POST `/auth/login` - Login user
- GET `/auth/me` - Get current user
- PUT `/auth/me` - Get current user
- PUT `/auth/updatedetails` - Update User Destails expect password
- PUT `/auth/updatepassword` - Reset password
- GET `/auth/users` - Get all users (Admin only)
- POST `/auth/register-admin` - Register admin User Only

## CRUD API Endpoints

- POST `/api/todos` - Add Todo
- GET `/api/todos` - Get Todos
- PUT `/api/todos/:id` - Update current todo
- DELETE `/api/todos/:id` - Delete current todo
