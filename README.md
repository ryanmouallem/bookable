# Bookable

Full-stack barbershop scheduling system built with TypeScript, Next.js, Express, and PostgreSQL.

**Live Demo:** https://bookable-33ju.vercel.app

---

## Features

- **Full Authentication** - JWT-based signup/login with secure password hashing
- **Appointment Management** - Complete CRUD operations for scheduling
- **Employee Dashboard** - Manage appointments, services, and barber availability
- **Instant Feedback** - Toast notifications for all user actions
- **Responsive Design** - Works seamlessly on desktop and mobile

---

## Tech Stack

**Frontend:**
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- React Hot Toast

**Backend:**
- Express 5
- TypeScript
- PostgreSQL (Supabase)
- JWT Authentication
- bcrypt

**Deployment:**
- Frontend: Vercel
- Backend: Vercel Serverless Functions
- Database: Supabase

---

## Local Development

### Prerequisites

- Node.js 18+
- PostgreSQL
- npm or yarn

### Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Update .env with your database credentials
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
cp .env.local.example .env.local
# Update .env.local with API URL
npm run dev
```

### Database Schema
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    role TEXT DEFAULT 'barber',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    client_name TEXT NOT NULL,
    client_phone TEXT,
    service TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration INTEGER NOT NULL,
    barber TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    notes TEXT,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Project Structure
```
bookable-app/
├── client/              # Next.js frontend
│   ├── app/
│   │   ├── components/  # React components
│   │   ├── types/       # TypeScript interfaces
│   │   └── page.tsx     # Main app
│   └── package.json
├── server/              # Express backend
│   ├── api/            # Vercel serverless entry
│   ├── src/
│   │   ├── config/     # Database config
│   │   ├── routes/     # API routes
│   │   └── middleware/ # Auth middleware
│   └── package.json
└── README.md
```

---

## API Endpoints

### Authentication
- `POST /auth/signup` - Create new user account
- `POST /auth/login` - Login and receive JWT token

### Appointments (Protected)
- `GET /appointments` - Get all appointments
- `POST /appointments` - Create appointment
- `PUT /appointments/:id` - Update appointment
- `DELETE /appointments/:id` - Delete appointment

### Resources (Protected)
- `GET /services` - Get available services
- `GET /barbers` - Get barber list

---

## What I Learned

Building Bookable taught me:
- Implementing secure JWT authentication flows
- Designing PostgreSQL schemas for real-world use cases
- Building responsive interfaces with React and Next.js
- Deploying full-stack applications to production
- Handling CORS in serverless environments
- Managing state across complex component hierarchies

---

## Future Enhancements

- Multi-service appointments
- Email notifications
- Calendar view
- Customer-facing booking page
- Payment integration
- Analytics dashboard

---

## License

MIT

---

## Contact

**Ryan Mouallem**
[GitHub](https://github.com/ryanmouallem) | [LinkedIn](https://www.linkedin.com/in/ryan-mouallem/)
