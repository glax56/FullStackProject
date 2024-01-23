import axios from "axios";

// Create an Axios instance with custom configuration
const api = axios.create({
  baseURL: "/api", // any request to /api will be routed to backend by setUpProxy.js
  timeout: 10000, // Set the timeout for requests (optional)
});

export default api;
