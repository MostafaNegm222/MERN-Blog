# MERN Social Feed

## 1. Description

A social media web app built with the MERN stack. Users sign up with a profile picture, log in, post text and images to a shared feed, like posts, add or remove friends, and visit profile pages. The interface has a light and dark theme.

## 2. Technologies and Versions

- **Client (`client/`)**: React ^18.2.0 (react-scripts 5.0.1), Material UI ^5.15.15 with @emotion/react ^11.11.4 and @emotion/styled ^11.11.5, Redux Toolkit ^2.2.3 with react-redux ^9.1.0 and redux-persist ^6.0.0, React Router ^6.22.3, Formik ^2.4.5 with Yup ^1.4.0, react-dropzone ^14.2.3
- **Server (`server/`)**: Node.js (ES modules) with Express ^4.19.2, MongoDB with Mongoose ^8.3.1, JWT ^9.0.2, bcrypt ^5.1.1, Multer ^1.4.4 (image upload to disk), Helmet ^7.1.0, morgan ^1.10.0, cors ^2.8.5, dotenv ^16.4.5
- **Tests**: Jest ^30.5.2 on the server, Jest through react-scripts on the client

## 3. Requirements and Dependencies

- Node.js installed
- A MongoDB database (local or Atlas)
- Dependencies are installed with `npm install` inside `server/` and `client/`

## 4. Installation and Run Steps

```bash
git clone https://github.com/MostafaNegm222/MERN-Blog.git
cd MERN-Blog
```

**Server**

```bash
cd server
npm install
# create server/.env with the variables from section 5
npm start       # node index.js   (or npm run dev for nodemon)
```

The client has the server address `http://localhost:3001` written into its fetch calls, so use port 3001. The server code falls back to 6001 if `PORT` is not set.

**Client** (in a second terminal)

```bash
cd client
npm install
npm start       # react-scripts start on http://localhost:3000
```

## 5. Environment Variables

Server `.env` (no secrets are stored in the repo):

| Variable | Purpose |
| --- | --- |
| `MONGO_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign login tokens |
| `PORT` | API port (use 3001 to match the client; default 6001) |

## 6. Usage and Main Features

**Client (React)**

- Login and registration form with validation (Formik and Yup) and profile picture upload (react-dropzone).
- Home page: your profile card, a post box with optional image, the feed, a friends list and an advert panel.
- Profile page for any user with their posts and friends.
- Protected routes: `/home` and `/profile/:userId` redirect to the login page without a token.
- Redux Toolkit holds the user, token, posts and theme mode, saved between visits with redux-persist. Light and dark themes.

**Server (Express + MongoDB)**

- `POST /auth/register` (with picture upload) and `POST /auth/login`; passwords hashed with bcrypt, login returns a JWT.
- `GET /users/:id`, `GET /users/:id/friends`, `PATCH /users/:id/:friendId` to add or remove a friend.
- `POST /posts` (with picture), `GET /posts` feed, `GET /posts/:userId/posts`, `PATCH /posts/:id/like` to toggle a like.
- All routes except register and login need `Authorization: Bearer <token>`.
- Uploaded images are saved on disk in `server/public/assets` and served from `/assets`.

## 7. Screenshots / Demo

No live demo; the app runs locally.

## 8. Running Tests

```bash
cd server && npm test     # Jest server tests in server/tests/
cd client && npm test     # react-scripts test for the client
```
