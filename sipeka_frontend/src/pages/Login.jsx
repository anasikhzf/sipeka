import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", form);
      localStorage.setItem("token", res.data.token);
      const me = await api.get("/me");
      localStorage.setItem("user", JSON.stringify(me.data));

      if (me.data.role === "admin") navigate("/admin/dashboard");
      else navigate("/user/home");
    } catch (err) {
      alert("Login gagal!");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60 z-0"
        style={{
          backgroundImage:
            "url(https://ppid.upnjatim.ac.id/wp-content/uploads/2024/06/GERBANG-UPNVJT-POLOS.jpg)",
        }}
      ></div>

      <div className="relative z-10 bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-900"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-900"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-900 text-white py-2 rounded-lg hover:bg-green-800 transition"
          >
            Login
          </button>
          <p className="text-center text-sm text-gray-600">
            Belum punya akun?{" "}
            <a href="/register" className="text-green-900 font-medium">
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
