const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000" // Dev URL
    : "https://spargen-ecom.onrender.com"; // Prod URL

export default BASE_URL;
