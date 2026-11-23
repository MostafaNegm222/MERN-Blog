# MERN Social Feed

A social media web app built with the MERN stack. Users sign up with a profile picture, log in, post text and images to a shared feed, like posts, add or remove friends, and visit profile pages. The interface has a light and dark theme.

## What it does

**Client (`client/`, React)**
- Login and registration form with validation (Formik and Yup) and profile picture upload (react-dropzone).
- Home page: your profile card, a post box with optional image, the feed, a friends list and an advert panel.
- Profile page for any user with their posts and friends.
- Protected routes: `/home` and `/profile/:userId` redirect to the login page without a token.
- Redux Toolkit holds the user, token, posts and theme mode, saved between visits with redux-persist.

**Server (`server/`, Express and MongoDB)**
- `POST /auth/register` (with picture upload) and `POST /auth/login`. Passwords are hashed with bcrypt, login returns a JWT.
- `GET /users/:id`, `GET /users/:id/friends`, `PATCH /users/:id/:friendId` to add or remove a friend.
- `POST /posts` (with picture), `GET /posts` feed, `GET /posts/:userId/posts`, `PATCH /posts/:id/like` to toggle a like.
- All routes except register and login need `Authorization: Bearer <token>`.
- Uploaded images are saved on disk in `server/public/assets` and served from `/assets`.

## Tech stack

- **Client:** React 18, Material UI 5, Redux Toolkit, redux-persist, React Router 6, Formik, Yup
- **Server:** Node.js (ES modules), Express 4, MongoDB with Mongoose 8, JWT, bcrypt, Multer, Helmet, Morgan
- **Tests:** Jest on the server, Jest through react-scripts on the client

## Project structure

```
├── client/src/
│   ├── scenes/        # loginPage, homePage, profilePage, navbar, widgets
│   ├── components/    # shared UI pieces
│   ├── state/         # Redux slice
│   └── theme.js       # light and dark theme
└── server/
    ├── controllers/   # auth, users, posts
    ├── models/        # User, Post
    ├── routes/  middleware/
    ├── data/          # sample users and posts (optional seed data)
    └── tests/         # Jest tests
```

## Run it locally

You need Node.js and a MongoDB database (local or Atlas).

**Server**

```bash
cd server
npm install
```

Create `server/.env`:

```
MONGO_URL=mongodb://127.0.0.1:27017/social
JWT_SECRET=choose-a-long-random-string
PORT=3001
```

```bash
npm start       # node index.js   (or npm run dev for nodemon)
```

The client has the server address `http://localhost:3001` written into its fetch calls, so use port 3001. The code falls back to 6001 if `PORT` is not set.

**Client**

```bash
cd client
npm install
npm start       # http://localhost:3000
```

Optional sample data: `server/data/index.js` has sample users and posts. Uncomment the two `insertMany` lines in `server/index.js` for one run to load them.

## Tests

```bash
cd server && npm test        # 12 tests
cd client && npm test        # 6 tests
```

- Server: the JWT middleware, login and register (password hashing, token), friend add and remove, friend list fields, like toggle and user posts. Mongoose models are mocked, so no database is needed.
- Client: every reducer in the Redux slice.

## Known limits

- The client uses hard-coded `http://localhost:3001` URLs, so it is not ready for deployment as is.
- Removing a friend only updates the caller's list correctly. The other user's list is not updated (a bug in `addRemoveFriend`).
- The comments field exists in the Post model but there is no route to add comments.
