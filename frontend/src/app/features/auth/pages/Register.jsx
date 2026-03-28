import React, { use, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister(form);
    setForm({ username: "", email: "", password: "" });
    navigate("/login");
  };
  
  return (
    <div className="mx-auto mt-12 w-full max-w-md rounded-lg border border-gray-700 bg-slate-900 p-6 shadow-lg shadow-black/40">
      <h2 className="mb-6 text-2xl font-semibold text-white">Register</h2>
      <form onSubmit={handleSubmit}>
        <label className="mb-4 block text-sm font-medium text-slate-200">
          Username
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            type="text"
            required
            className="mt-1 block w-full rounded-md border border-gray-600 bg-slate-950 p-2 text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </label>
        <label className="mb-4 block text-sm font-medium text-slate-200">
          Email
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            required
            className="mt-1 block w-full rounded-md border border-gray-600 bg-slate-950 p-2 text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </label>
        <label className="mb-4 block text-sm font-medium text-slate-200">
          Password
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            required
            className="mt-1 block w-full rounded-md border border-gray-600 bg-slate-950 p-2 text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Register
        </button>
      </form>
      <div className="text-white flex items-center justify-center mt-5">
        <p>
          already registered ?{" "}
          <Link className="text-blue-700" to={"/login"}>
            {" "}
            login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
