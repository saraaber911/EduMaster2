import React, { useState } from "react";
import { GiGraduateCap } from "react-icons/gi";


export default function SignupForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    cpassword: "",
    phoneNumber: "",
    classLevel: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://edu-master-psi.vercel.app/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        setMessage("✅ Account created successfully!");
        console.log(data);
      } else {
        const error = await res.json();
        setMessage("❌ Error: " + error.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Network error, please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--primary-bg)] ">
      {/* <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_10px_30px_rgba(15,23,42,0.08)] p-8 sm:p-10"> */}
        {/* Header with badge */}
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 w-[460px] shadow-xl  m-5">
         
        {/* mortarboard svg */}
        <div className="flex items-center gap-3 mb-4">
          <div className="text-gray-50 bg-[var(--primary)] p-3 w-15 h-15 flex items-center justify-center rounded-lg">
            <GiGraduateCap className="text-white w-10 h-10" />
          </div>
          <div className="text-lg font-bold">EduMaster</div>
        </div>

        <h1 className="text-3xl font-bold mb-1">Create your account</h1>
        <p className="text-sm text-gray-500 mb-5">Join the community and start learning today</p>

       
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            className="mt-1 mb-4 w-full p-3 rounded-xl bg-gray-100"
            required
          />
        <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 mb-4 w-full p-3 rounded-xl bg-gray-100"
            required
          />

          <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 mb-4 w-full p-3 rounded-xl bg-gray-100"
              required
            />
            <p className="mt-2 text-xs text-slate-400">Use at least 8 characters, including a number</p>
          </div>
        <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            name="cpassword"
            placeholder="Re-enter your password"
            value={formData.cpassword}
            onChange={handleChange}
            className="mt-1 mb-4 w-full p-3 rounded-xl bg-gray-100"
            required
          />
        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input
            type="Phone"
            name="phoneNumber"
            placeholder="Enter your Phone"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="mt-1 mb-4 w-full p-3 rounded-xl bg-gray-100"
            required
          />
        <label className="block text-sm font-medium text-gray-700">Grade</label>
          <select
            name="classLevel"
            value={formData.classLevel}
            onChange={handleChange}
            className="mt-1 mb-4 w-full p-3 rounded-xl bg-gray-100"
            required
          >
            <option value="">Select your grade</option>
            <option value="Grade 1 Secondary">Grade 1 Secondary</option>
            <option value="Grade 2 Secondary">Grade 2 Secondary</option>
            <option value="Grade 3 Secondary">Grade 3 Secondary</option>
          </select>

          <div className="flex items-center gap-3">
            <input id="terms" type="checkbox" className="w-4 h-4 text-blue-500 bg-white border rounded" />
            <label htmlFor="terms" className="text-sm text-slate-500">I agree to the <a href="#" className="text-blue-500 underline">Terms</a> and <a href="#" className="text-blue-500 underline">Privacy Policy</a></label>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full text-white font-semibold bg-gradient-to-r from-blue-400 to-blue-500 shadow-md hover:from-blue-500 hover:to-blue-600 transition"
          >
            Create account
          </button>
        

        {message && (
          <p className="mt-4 text-center text-sm text-slate-700">{message}</p>
        )}

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account? <a href="/login" className="text-blue-500 hover:underline">Log in</a>
        </p>
      </form>

      {/* </div> */}
    </div>
  );
}
