const API_URL =
  import.meta.env.VITE_API_URL || "https://aeedk-backend.onrender.com/api";
export default API_URL;
fetch("https://aeedk-backend.onrender.com/api/user/1", {
  headers: {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc1MDY4MDUzNywianRpIjoiMzQ5ZmIzM2MtYjc4MC00NGZmLWEwM2QtODg2NjRmODc0OWUzIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MSwibmJmIjoxNzUwNjgwNTM3LCJjc3JmIjoiOWI0NzQxODMtYjM1ZS00OTYzLWJmYmUtNGY1N2IwY2ZkYTYyIiwiZXhwIjoxNzUwNzIzNzM3fQ.GELwHtLSxigdXRDii6i6fqpfV8oRyeUsdBLWzlHXcTs",
  },
})
  .then((r) => r.json())
  .then(console.log);
