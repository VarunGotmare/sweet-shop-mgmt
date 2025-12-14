import api from "./api/axios";

function App() {
const checkApi = async () => {
    try {
      const res = await api.get("/health"); // or /api/health
      console.log("Health OK:", res.data);
      alert("Backend is reachable ✅");
    } catch (err) {
      console.error("Health check failed:", err);
      alert("Backend NOT reachable ❌");
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950">
      <h1 className="text-3xl font-bold text-pink-500">
        Sweet Management System 🍬
      </h1>
      <button
        onClick={checkApi}
        className="ml-4 mt-6 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition"
      >
        Check Api Connection
      </button>
    </div>
  );
}

export default App;

