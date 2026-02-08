import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AppContext } from "../Context/Appcontext";

const Login = () => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { axios } = useContext(AppContext);

  // Password validation function
  const validatePassword = (pass) => {
    const errors = [];

    if (pass.length < 8) {
      errors.push("Must be at least 8 characters");
    }
    if (!/[A-Z]/.test(pass)) {
      errors.push("Must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(pass)) {
      errors.push("Must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(pass)) {
      errors.push("Must contain at least one number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) {
      errors.push("Must contain at least one special character");
    }

    return errors;
  };

  // Handle password change with real-time validation (for signup only)
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Only validate in register mode
    if (state === "register") {
      const errors = validatePassword(newPassword);
      setPasswordErrors(errors);
    }
  };

  // Calculate password strength
  const getPasswordStrength = () => {
    if (password.length === 0) return { level: 0, text: "", color: "" };

    const errors = validatePassword(password);
    const strength = 5 - errors.length;

    if (strength <= 2)
      return { level: strength, text: "Weak", color: "bg-red-500" };
    if (strength <= 4)
      return { level: strength, text: "Medium", color: "bg-yellow-500" };
    return { level: strength, text: "Strong", color: "bg-green-500" };
  };

  const strength = getPasswordStrength();

  // Reset form when switching between login and register
  const handleStateChange = (newState) => {
    setState(newState);
    setPassword("");
    setConfirmPassword("");
    setPasswordErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only validate password on signup
    if (state === "register") {
      const errors = validatePassword(password);
      if (errors.length > 0) {
        toast.error("Please fix password errors");
        return;
      }

      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
    }

    const url = state === "login" ? "/api/auth/login" : "/api/auth/register";

    try {
      const { data } = await axios.post(url, { name, email, password });

      if (data.success) {
        window.location.reload();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-slate-900 rounded-lg shadow-xl border border-gray-300 bg-white"
    >
      <p className="text-2xl font-medium m-auto">
        <span className="text-purple-500">User</span>{" "}
        {state === "login" ? "Login" : "Sign Up"}
      </p>

      {/* Name Field (only for register) */}
      {state === "register" && (
        <div className="w-full">
          <p>Name</p>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-purple-500"
            type="text"
            required
          />
        </div>
      )}

      {/* Email Field */}
      <div className="w-full">
        <p>Email</p>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="type here"
          className="border border-gray-200 rounded w-full p-2 mt-1 outline-purple-500"
          type="email"
          required
        />
      </div>

      {/* Password Field with Validation UI */}
      <div className="w-full">
        <p>Password</p>
        <div className="relative">
          <input
            onChange={handlePasswordChange}
            value={password}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 pr-10 outline-purple-500"
            type={showPassword ? "text" : "password"}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-500 mt-0.5"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Password Strength Indicator (only for register) */}
        {state === "register" && password.length > 0 && (
          <div className="mt-2">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded transition-all duration-300 ${level <= strength.level ? strength.color : "bg-gray-200"
                    }`}
                />
              ))}
            </div>
            <p
              className={`text-xs ${strength.text === "Weak"
                  ? "text-red-500"
                  : strength.text === "Medium"
                    ? "text-yellow-600"
                    : "text-green-500"
                }`}
            >
              Password Strength: {strength.text}
            </p>
          </div>
        )}

        {/* Error Messages */}
        {state === "register" && passwordErrors.length > 0 && (
          <ul className="mt-2 text-xs text-red-500 list-disc pl-4 space-y-1">
            {passwordErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Confirm Password (only for register) */}
      {state === "register" && (
        <div className="w-full">
          <p>Confirm Password</p>
          <div className="relative">
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              placeholder="re-enter password"
              className={`border rounded w-full p-2 mt-1 pr-10 outline-purple-500 ${confirmPassword && password !== confirmPassword
                  ? "border-red-500"
                  : "border-gray-200"
                }`}
              type={showConfirmPassword ? "text" : "password"}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-500 mt-0.5"
            >
              {showConfirmPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
          )}
          {confirmPassword && password === confirmPassword && confirmPassword.length > 0 && (
            <p className="text-xs text-green-500 mt-1">✓ Passwords match</p>
          )}
        </div>
      )}

      {/* Toggle between Login and Register */}
      {state === "register" ? (
        <p>
          Already have account?{" "}
          <span
            onClick={() => handleStateChange("login")}
            className="text-purple-500 cursor-pointer hover:text-purple-800"
          >
            click here
          </span>
        </p>
      ) : (
        <p>
          Create an account?{" "}
          <span
            onClick={() => handleStateChange("register")}
            className="text-purple-500 cursor-pointer hover:text-purple-800"
          >
            click here
          </span>
        </p>
      )}

      <button className="bg-purple-500 hover:bg-purple-600 transition-all text-white w-full py-2 rounded-md cursor-pointer">
        {state === "register" ? "Create Account" : "Login"}
      </button>
    </form>
  );
};

export default Login;
