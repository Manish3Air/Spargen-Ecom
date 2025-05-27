# 🛍️ Spargen-Ecom

**Spargen-Ecom** is a modern, full-stack e-commerce platform built using Next.js, TypeScript, MongoDB, Express.js, and Tailwind CSS. It offers a seamless shopping experience for users and a powerful admin dashboard to manage products, users, and orders.

---

## 🚀 Features

### 👤 User Functionality
- 🔐 Register & Login with JWT authentication
- 🔑 Google Login via OAuth
- 🛒 Add to Cart and Checkout
- ❤️ Wishlist (stored per user using localStorage)
- 📦 View Order History
- ✍️ Submit Product Reviews
- 🎤 Voice Search with Web Speech API
- 🌗 Dark/Light Theme Toggle

### 🧑‍💼 Admin Functionality
- 📋 View/Add/Edit/Delete Products
- 👥 Manage Users and Update Roles
- 📦 View and Update Order Status
- 📊 Admin Analytics Dashboard
- 🔐 Protected Routes using Middleware

### ✨ UI/UX Highlights
- 🎨 Neumorphic and animated UI components
- 📽️ VideoText masked video headings
- 🧲 Custom animated buttons (`RainbowButton`)
- 🧠 AI-powered features (Script Writing section)
- 💡 Responsive, mobile-friendly design

---

## 🧰 Tech Stack

| Frontend       | Backend         | Database     | Auth           | UI & Styling     |
|----------------|-----------------|--------------|----------------|------------------|
| Next.js        | Node.js         | MongoDB      | JWT / Google   | Tailwind CSS     |
| React          | Express.js      | Mongoose     | bcryptjs       | MagicUI Elements |
| TypeScript     | REST APIs       |              |     |          |

---

## 🧱 Folder Structure
spargen-ecom/
├── frontend/
│ ├── components/
│ │ ├── magicui/ # Custom animations (VideoText, RainbowButton)
│ ├── pages/ # Route-based pages
│ ├── lib/ # Utilities (e.g., cn.ts)
│ ├── styles/ # Tailwind and global CSS
│ ├── public/ # Static assets and screenshots
│ └── .env.local # Frontend env config
│
├── backend/
│ ├── controllers/ # Logic for routes
│ ├── models/ # Mongoose models (User, Product, Order, Review)
│ ├── routes/ # Auth, product, user, order, review routes
│ ├── middleware/ # protect, isAdmin
│ ├── config/ # DB config and dotenv
│ └── .env # Backend env config

---

## 📦 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/spargen-ecom.git
cd spargen-ecom
```
### 2️⃣ Environment Variables

#### Frontend Environment variables
- NEXT_PUBLIC_API_URL=http://localhost:5000
- NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

#### Backend Environment variables
- PORT=5000
- MONGO_URI=your_mongodb_uri
- JWT_SECRET=your_jwt_secret
- GOOGLE_CLIENT_ID=your_google_client_id
- GOOGLE_CLIENT_SECRET=your_google_client_secret
  
### 3️⃣ Install Dependencies
- Backend
```bash
cd backend
npm install
npm run dev
```
- Frontend
```bash
cd frontend
npm install
npm run dev
```
## 📸 Screenshots
- Admin
- Dashboard
## 🎯 Roadmap & Future Enhancements
- 🔍 Advanced filtering, sorting, and search for products
- 📱 Progressive Web App (PWA) support
- ✉️ Email notifications for orders
- 🧾 Invoice generation
- 🧠 AI-based product recommendation system
## 🤝 Contributing
- Fork the repository
- Create your branch (git checkout -b feature/my-feature)
- Commit your changes (git commit -m 'Add new feature')
- Push to the branch (git push origin feature/my-feature)
- Open a Pull Request
## 📜 License
MIT © 2025 [Manish Raj Pandey]
## 🧑‍💻 Author
Manish [Spargen-Ecom Creator]
Crafted with ❤️ and countless commits.
Connect with me:
GitHub: @Manish3Air
LinkedIn: @Manish


