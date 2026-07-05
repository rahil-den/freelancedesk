# FreelanceDesk

A weekend project. Simple project management tool for freelancers — track clients, projects, and deliverables in one place.

## Stack

- **Frontend** — Next.js, Tailwind CSS
- **Backend** — Node.js, Express
- **Database** — MongoDB

## Running locally

**Backend**
```bash
cd server
pnpm dev
```

**Frontend**
```bash
cd client
pnpm dev
```

Requires a `.env` in `/server`:
```
PORT=5000
MONGO_URL=mongodb://localhost:27017/freelancedesk
JWT_SECRET=your_secret
```