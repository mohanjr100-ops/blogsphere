# BlogSphere

A full-stack blogging platform built with **React (Vite)**, **Tailwind CSS**, **Node.js**, **Express**, and **MongoDB (Mongoose)**, featuring JWT authentication, author-only post management, pagination, and post comments.

## Folder Structure

```text
blogsphere/
├── README.md
├── render.yaml
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── commentController.js
│   │   └── postController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── ownershipMiddleware.js
│   ├── models/
│   │   ├── Comment.js
│   │   ├── Post.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── commentRoutes.js
│   │   └── postRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── client/
    ├── public/
    │   └── _redirects
    ├── src/
    │   ├── api/
    │   │   └── axios.js
    │   ├── components/
    │   │   ├── CommentSection.jsx
    │   │   ├── ErrorAlert.jsx
    │   │   ├── Footer.jsx
    │   │   ├── LoadingSpinner.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── Pagination.jsx
    │   │   ├── PostCard.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── DashboardPage.jsx
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── NotFoundPage.jsx
    │   │   ├── PostDetailPage.jsx
    │   │   ├── PostEditorPage.jsx
    │   │   └── RegisterPage.jsx
    │   ├── utils/
    │   │   └── formatDate.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── vite.config.js
```

---

## Run Locally

### Prerequisites
- Node.js 18+ and npm
- A MongoDB connection string (local MongoDB or MongoDB Atlas)

### 1. Start the Backend (`server`)

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/blogsphere?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_random_string
CLIENT_URL=http://localhost:5173
```

Run the server:

```bash
npm run dev
```

The API will run at `http://localhost:5000` (health check: `GET http://localhost:5000/api/health`).

### 2. Start the Frontend (`client`)

Open a second terminal:

```bash
cd client
npm install
cp .env.example .env
```

Verify `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run the Vite dev server:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Deploy on Render

### Option A: Manual Setup (Recommended for clear step-by-step control)

1. **Push the repository** to GitHub or GitLab.
2. **Create a MongoDB Atlas database** (free M0 tier works) and copy your `MONGO_URI`. Ensure Atlas Network Access allows Render IPs (`0.0.0.0/0`).
3. **Deploy the Backend (Web Service):**
   - In Render Dashboard, click **New + -> Web Service** and select your repo.
   - **Root Directory:** `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/api/health`
   - **Environment Variables:**
     - `MONGO_URI`: your MongoDB Atlas URI
     - `JWT_SECRET`: a strong random secret
     - `PORT`: `5000`
     - `CLIENT_URL`: your Render Static Site URL once created (e.g. `https://blogsphere.onrender.com`)
   - Copy the deployed backend URL (e.g. `https://blogsphere-api.onrender.com`).
4. **Deploy the Frontend (Static Site):**
   - In Render Dashboard, click **New + -> Static Site** and select the same repo.
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
   - **Environment Variable:**
     - `VITE_API_URL`: `https://blogsphere-api.onrender.com/api`
   - **Redirects/Rewrites:** `client/public/_redirects` already includes `/* /index.html 200` for React Router SPA routes (or configure the same rewrite in Render's **Redirects/Rewrites** tab).
5. **Update `CLIENT_URL`** in the backend Web Service environment variables with your final frontend URL and redeploy if needed.

### Option B: Blueprint (`render.yaml`)
The root `render.yaml` defines both `blogsphere-api` (Node Web Service) and `blogsphere-client` (Static Site with SPA rewrite). Connect the repo via **New + -> Blueprint** in Render and fill in `MONGO_URI`, `CLIENT_URL`, and `VITE_API_URL`.

---

## REST API Documentation

Base URL: `/api`

Protected endpoints require header:
`Authorization: Bearer <jwt_token>`

### Auth

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register user (`name`, `email`, `password`). Returns `{ token, user }` (`201`). |
| `POST` | `/api/auth/login` | Public | Authenticate user (`email`, `password`). Returns `{ token, user }` (`200`). |
| `GET` | `/api/auth/me` | Protected | Return current authenticated user (`200`). |

### Posts

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/posts` | Public | List posts with pagination (`?page=1&limit=6&author=<id>&search=<term>`). |
| `GET` | `/api/posts/:id` | Public | Get a single post by ID. |
| `POST` | `/api/posts` | Protected | Create a new post (`title`, `content`). |
| `PUT` | `/api/posts/:id` | Owner Only | Update an existing post (`title`, `content`). |
| `DELETE` | `/api/posts/:id` | Owner Only | Delete a post and its associated comments. |

### Comments

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/posts/:id/comments` | Public | List comments for a post (newest first). |
| `POST` | `/api/posts/:id/comments` | Protected | Add a comment (`text`) to a post. |
| `DELETE` | `/api/comments/:id` | Owner Only | Delete your own comment. |

### Error Responses

Errors return JSON `{ "message": "..." }` with standard HTTP status codes:
- `400` Bad Request — validation failure, duplicate email, or invalid ObjectId
- `401` Unauthorized — missing, invalid, or expired JWT, or bad login credentials
- `403` Forbidden — attempting to edit/delete another user's post or comment
- `404` Not Found — resource or route does not exist
