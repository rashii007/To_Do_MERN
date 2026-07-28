# 📝 MERN Todo App

A full-stack Todo Application built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). It allows users to securely manage their daily tasks with authentication, a dashboard, dark/light mode, and responsive design.

## 🚀 Features

* 🔐 User Authentication (JWT)
* 👤 User Registration & Login
* ➕ Create Todo
* ✏️ Update Todo
* ✅ Mark Todo as Completed
* 🗑️ Delete Todo
* 📊 Dashboard with Statistics
* 🌙 Dark & Light Mode
* 📱 Responsive UI
* 🔒 Protected Routes

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router DOM

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs
* dotenv

---

## 📂 Project Structure

```
todo-app/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/todo-app.git
```

### Backend

```bash
cd server
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend:

```bash
npm run dev
```

---

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## 📡 API Endpoints

### Authentication

* `POST /api/auth/register`
* `POST /api/auth/login`

### Todos

* `GET /api/todo/get`
* `POST /api/todo/create`
* `PUT /api/todo/update/:id`
* `DELETE /api/todo/delete/:id`

### Dashboard

* `GET /api/dashboard`

---

## 📸 Screenshots

Add screenshots of:

* Login Page
* Register Page
* Home Page
* Dashboard
* Dark Mode

---

## 📌 Future Improvements

* Search Todos
* Filter by Status
* Priority Levels
* Due Date Reminders
* Drag & Drop
* Pagination
* Email Notifications

---

## 👨‍💻 Author

**Muhammad Rashid Khan**

## 📄 License

This project is licensed under the MIT License.
