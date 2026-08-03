import { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../services/authApi";
import { ThemeContext } from "../context/ThemeContext";
import ThemeButton from "../components/ThemeButton";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Fingerprint,
  Shield,
  // ❌ REMOVED: Github, Twitter (they don't exist in lucide-react)
  LogIn,
  UserPlus,
  Home,
  ChevronLeft,
} from "lucide-react";

// ✅ ADD React Icons
import { FaGithub, FaTwitter } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useContext(ThemeContext);

  // ============ STATES ============
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [focused, setFocused] = useState(null);

  // Refs for animations
  const formRef = useRef(null);
  const emailInputRef = useRef(null);

  // ============ REDIRECT FROM REGISTER ============
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setTimeout(() => setSuccessMessage(""), 5000);
    }
  }, [location]);

  // ============ AUTO FOCUS ============
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  // ============ HANDLERS ============
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Clear error on change
    if (error) setError("");
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    setFocused(null);
  };

  const handleFocus = (field) => {
    setFocused(field);
  };

  const validateForm = () => {
    const errors = [];

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.push("Email is required");
    } else if (!emailRegex.test(formData.email)) {
      errors.push("Please enter a valid email address");
    }

    // Password validation
    if (!formData.password) {
      errors.push("Password is required");
    } else if (formData.password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }

    return errors;
  };

  // pages/Login.jsx
  // pages/Login.jsx
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      console.log("Login Response:", response);

      // ✅ Store token
      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      // ✅ Extract user ID from token
      let userId = null;
      try {
        const token = response.token || localStorage.getItem("token");
        if (token) {
          const payload = JSON.parse(atob(token.split(".")[1]));
          userId = payload.id || payload._id || null;
          console.log("User ID from token:", userId);
        }
      } catch (err) {
        console.error("Error extracting ID:", err);
      }

      // ✅ Create user object with _id
      const userData = {
        name: response.user?.name || formData.email.split("@")[0] || "User",
        email: response.user?.email || formData.email,
        _id: response.user?._id || userId, // ✅ _id add karein
      };

      console.log("Final User Data:", userData);
      localStorage.setItem("user", JSON.stringify(userData));

      setSuccessMessage(response.message || "Login successful! 🎉");

      setTimeout(() => {
        navigate("/", {
          replace: true,
          state: { message: "Welcome back! 👋" },
        });
      }, 1500);
    } catch (error) {
      console.error("Login Error:", error);
      setError(error.userMessage || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Helper to fetch user profile
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log("Profile response:", data);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("✅ User fetched and stored:", data.user);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50 dark:from-slate-950 dark:via-slate-900/50 dark:to-slate-950 transition-colors duration-500 p-4">
      {/* Back to Home Button */}
      <Link
        to="/"
        className="absolute top-4 left-4 p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-lg hover:scale-105"
      >
        <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
      </Link>

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeButton />
      </div>

      {/* ============ MAIN CARD ============ */}
      <div ref={formRef} className="w-full max-w-md relative">
        {/* Animated Gradient Background */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-30 animate-gradient"></div>

        {/* Card */}
        <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8 transition-all duration-300">
          {/* ============ HEADER ============ */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                <LogIn className="w-8 h-8 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Welcome Back!
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Sign in to continue managing your todos
            </p>
          </div>

          {/* ============ SUCCESS MESSAGE ============ */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400 text-sm flex items-center gap-2 animate-fadeIn">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ============ ERROR MESSAGE ============ */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ============ FORM ============ */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                Email Address
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  ref={emailInputRef}
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => handleFocus("email")}
                  onBlur={() => handleBlur("email")}
                  required
                  className={`w-full px-4 py-3 pl-11 rounded-xl border-2 transition-all duration-300
                    bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm
                    ${
                      focused === "email"
                        ? "border-blue-500 dark:border-blue-400 ring-4 ring-blue-500/20"
                        : touched.email && !formData.email
                          ? "border-red-500 dark:border-red-400"
                          : "border-gray-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500"
                    }
                    text-gray-900 dark:text-white
                    placeholder-gray-400 dark:placeholder-gray-500
                    outline-none shadow-lg shadow-blue-500/5
                  `}
                />
                <Mail
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300
                    ${
                      focused === "email"
                        ? "text-blue-500 dark:text-blue-400"
                        : "text-slate-400 dark:text-slate-500"
                    }
                  `}
                />
                {touched.email && !formData.email && (
                  <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                )}
              </div>
              {touched.email && !formData.email && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Email is required
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-400" />
                Password
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => handleFocus("password")}
                  onBlur={() => handleBlur("password")}
                  required
                  className={`w-full px-4 py-3 pl-11 pr-12 rounded-xl border-2 transition-all duration-300
                    bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm
                    ${
                      focused === "password"
                        ? "border-blue-500 dark:border-blue-400 ring-4 ring-blue-500/20"
                        : touched.password &&
                            formData.password.length < 6 &&
                            formData.password.length > 0
                          ? "border-red-500 dark:border-red-400"
                          : "border-gray-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500"
                    }
                    text-gray-900 dark:text-white
                    placeholder-gray-400 dark:placeholder-gray-500
                    outline-none shadow-lg shadow-blue-500/5
                  `}
                />
                <Lock
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300
                    ${
                      focused === "password"
                        ? "text-blue-500 dark:text-blue-400"
                        : "text-slate-400 dark:text-slate-500"
                    }
                  `}
                />

                {/* Toggle Password */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                  ) : (
                    <Eye className="w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          formData.password.length >= 8
                            ? "w-full bg-green-500"
                            : formData.password.length >= 6
                              ? "w-2/3 bg-yellow-500"
                              : "w-1/3 bg-red-500"
                        }`}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {formData.password.length >= 8
                        ? "Strong 💪"
                        : formData.password.length >= 6
                          ? "Good 👍"
                          : "Weak ⚠️"}
                    </span>
                  </div>
                  {formData.password.length > 0 &&
                    formData.password.length < 6 && (
                      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Minimum 6 characters required
                      </p>
                    )}
                </div>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 transition-colors"
                />
                <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`relative w-full group overflow-hidden rounded-xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="relative flex items-center justify-center gap-3 px-6 py-3.5">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span className="font-bold text-lg tracking-wide text-white">
                      Signing in...
                    </span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300 text-white" />
                    <span className="font-bold text-lg tracking-wide text-white">
                      Sign In
                    </span>
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-white" />
                  </>
                )}
              </div>
            </button>

            {/* ============ DIVIDER ============ */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/90 dark:bg-slate-800/90 text-slate-500 dark:text-slate-400">
                  Or continue with
                </span>
              </div>
            </div>

            {/* ============ SOCIAL LOGIN ============ */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin("Google")}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all hover:scale-105"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300 hidden sm:inline">
                  Google
                </span>
              </button>

              {/* ✅ FIXED - Using react-icons */}
              <button
                type="button"
                onClick={() => handleSocialLogin("Github")}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all hover:scale-105"
              >
                <FaGithub className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300 hidden sm:inline">
                  GitHub
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin("Twitter")}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all hover:scale-105"
              >
                <FaTwitter className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300 hidden sm:inline">
                  Twitter
                </span>
              </button>
            </div>
          </form>

          {/* ============ REGISTER LINK ============ */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                state={{ from: location.pathname }}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center justify-center gap-1"
              >
                Create an account
                <UserPlus className="w-4 h-4" />
              </Link>
            </p>
          </div>

          {/* ============ SECURITY BADGE ============ */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <Shield className="w-3 h-3" />
            <span>256-bit encrypted connection</span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
            <Fingerprint className="w-3 h-3" />
            <span>Secure login</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
