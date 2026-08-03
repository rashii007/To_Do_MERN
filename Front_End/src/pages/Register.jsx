import { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { registerUser } from "../services/authApi";
import { ThemeContext } from "../context/ThemeContext";
import ThemeButton from "../components/ThemeButton";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle,
  Sparkles,
  ArrowRight,
  UserPlus,
  Shield,
  Fingerprint,
  Home,
  ChevronLeft,
  Check,
  X,
} from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useContext(ThemeContext);

  // ============ STATES ============
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [focused, setFocused] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "Weak",
    color: "red",
    checks: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    },
  });

  // Refs
  const formRef = useRef(null);
  const nameInputRef = useRef(null);

  // ============ AUTO FOCUS ============
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  // ============ PASSWORD STRENGTH CHECKER ============
  const checkPasswordStrength = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;

    let label, color;
    if (score <= 2) {
      label = "Weak";
      color = "red";
    } else if (score === 3) {
      label = "Good";
      color = "yellow";
    } else if (score === 4) {
      label = "Strong";
      color = "blue";
    } else {
      label = "Very Strong";
      color = "green";
    }

    setPasswordStrength({ score, label, color, checks });
  };

  // ============ HANDLERS ============
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });

    // Clear error on change
    if (error) setError("");

    // Check password strength
    if (name === "password") {
      checkPasswordStrength(value);
    }

    // Auto-check confirm password
    if (name === "confirmPassword" && formData.password) {
      // Trigger validation
    }
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

    // Name validation
    if (!formData.name || !formData.name.trim()) {
      errors.push("Full name is required");
    } else if (formData.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters");
    }

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
    } else if (passwordStrength.score < 3) {
      errors.push("Password is too weak. Please use a stronger password");
    }

    // Confirm password
    if (!formData.confirmPassword) {
      errors.push("Please confirm your password");
    } else if (formData.password !== formData.confirmPassword) {
      errors.push("Passwords do not match");
    }

    // Terms agreement
    if (!formData.agreeTerms) {
      errors.push("Please agree to the Terms & Conditions");
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors[0]);
      // Shake animation
      if (formRef.current) {
        formRef.current.classList.add("animate-shake");
        setTimeout(() => {
          formRef.current.classList.remove("animate-shake");
        }, 500);
      }
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const data = await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      console.log("Register Response:", data);

      setSuccessMessage(data.message || "Registration successful! 🎉");

      // Redirect after delay
      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: {
            message: "Account created successfully! Please login to continue.",
          },
        });
      }, 2000);
    } catch (error) {
      console.error("Register Error:", error);
      setError(
        error.userMessage ||
          error.message ||
          "Registration failed. Please try again.",
      );
      // Shake animation
      if (formRef.current) {
        formRef.current.classList.add("animate-shake");
        setTimeout(() => {
          formRef.current.classList.remove("animate-shake");
        }, 500);
      }
    } finally {
      setLoading(false);
    }
  };

  // ============ PASSWORD STRENGTH INDICATOR ============
  const renderPasswordChecks = () => {
    const { checks } = passwordStrength;
    const checkItems = [
      { key: "length", label: "At least 8 characters" },
      { key: "uppercase", label: "One uppercase letter" },
      { key: "lowercase", label: "One lowercase letter" },
      { key: "number", label: "One number" },
      { key: "special", label: "One special character" },
    ];

    return (
      <div className="mt-2 space-y-1">
        {checkItems.map((item) => (
          <div key={item.key} className="flex items-center gap-2 text-xs">
            {checks[item.key] ? (
              <Check className="w-3 h-3 text-green-500" />
            ) : (
              <X className="w-3 h-3 text-red-400" />
            )}
            <span
              className={
                checks[item.key]
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-400 dark:text-red-500"
              }
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    );
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
        <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-2xl blur-xl opacity-30 animate-gradient"></div>

        {/* Card */}
        <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8 transition-all duration-300">
          {/* ============ HEADER ============ */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl shadow-lg">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 dark:from-green-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Join us and start managing your tasks
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
            {/* Name Field */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                Full Name
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  ref={nameInputRef}
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => handleFocus("name")}
                  onBlur={() => handleBlur("name")}
                  required
                  className={`w-full px-4 py-3 pl-11 rounded-xl border-2 transition-all duration-300
                    bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm
                    ${
                      focused === "name"
                        ? "border-blue-500 dark:border-blue-400 ring-4 ring-blue-500/20"
                        : touched.name && !formData.name
                          ? "border-red-500 dark:border-red-400"
                          : "border-gray-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500"
                    }
                    text-gray-900 dark:text-white
                    placeholder-gray-400 dark:placeholder-gray-500
                    outline-none shadow-lg shadow-blue-500/5
                  `}
                />
                <User
                  className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300
                  ${
                    focused === "name"
                      ? "text-blue-500 dark:text-blue-400"
                      : "text-slate-400 dark:text-slate-500"
                  }
                `}
                />
                {touched.name && !formData.name && (
                  <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                )}
              </div>
              {touched.name && !formData.name && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Name is required
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                Email Address
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
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
                  placeholder="Create a strong password"
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
                            formData.password.length > 0 &&
                            passwordStrength.score < 3
                          ? "border-red-500 dark:border-red-400"
                          : touched.password &&
                              formData.password.length > 0 &&
                              passwordStrength.score >= 3
                            ? "border-green-500 dark:border-green-400"
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

              {/* Password Strength Meter */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          passwordStrength.score <= 2
                            ? "w-1/3 bg-red-500"
                            : passwordStrength.score === 3
                              ? "w-2/3 bg-yellow-500"
                              : passwordStrength.score === 4
                                ? "w-4/5 bg-blue-500"
                                : "w-full bg-green-500"
                        }`}
                      ></div>
                    </div>
                    <span
                      className={`text-xs font-medium whitespace-nowrap
                      ${
                        passwordStrength.score <= 2
                          ? "text-red-500"
                          : passwordStrength.score === 3
                            ? "text-yellow-500"
                            : passwordStrength.score === 4
                              ? "text-blue-500"
                              : "text-green-500"
                      }
                    `}
                    >
                      {passwordStrength.label}
                    </span>
                  </div>

                  {/* Password Checks */}
                  {touched.password && renderPasswordChecks()}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-400" />
                Confirm Password
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => handleFocus("confirmPassword")}
                  onBlur={() => handleBlur("confirmPassword")}
                  required
                  className={`w-full px-4 py-3 pl-11 pr-12 rounded-xl border-2 transition-all duration-300
                    bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm
                    ${
                      focused === "confirmPassword"
                        ? "border-blue-500 dark:border-blue-400 ring-4 ring-blue-500/20"
                        : touched.confirmPassword &&
                            formData.confirmPassword &&
                            formData.password !== formData.confirmPassword
                          ? "border-red-500 dark:border-red-400"
                          : touched.confirmPassword &&
                              formData.confirmPassword &&
                              formData.password === formData.confirmPassword
                            ? "border-green-500 dark:border-green-400"
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
                    focused === "confirmPassword"
                      ? "text-blue-500 dark:text-blue-400"
                      : "text-slate-400 dark:text-slate-500"
                  }
                `}
                />

                {/* Toggle Confirm Password */}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                  ) : (
                    <Eye className="w-5 h-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                  )}
                </button>
              </div>

              {/* Password Match Indicator */}
              {touched.confirmPassword && formData.confirmPassword && (
                <p
                  className={`mt-1 text-xs flex items-center gap-1 ${
                    formData.password === formData.confirmPassword
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <Check className="w-3 h-3" />
                      Passwords match
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3" />
                      Passwords do not match
                    </>
                  )}
                </p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="mt-1 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 transition-colors"
              />
              <label className="text-sm text-slate-600 dark:text-slate-300">
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`relative w-full group overflow-hidden rounded-xl shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="relative flex items-center justify-center gap-3 px-6 py-3.5">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span className="font-bold text-lg tracking-wide text-white">
                      Creating Account...
                    </span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300 text-white" />
                    <span className="font-bold text-lg tracking-wide text-white">
                      Create Account
                    </span>
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-white" />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* ============ LOGIN LINK ============ */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                state={{ from: location.pathname }}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center justify-center gap-1"
              >
                Sign in here
                <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </div>

          {/* ============ SECURITY BADGE ============ */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <Shield className="w-3 h-3" />
            <span>256-bit encrypted connection</span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
            <Fingerprint className="w-3 h-3" />
            <span>Secure registration</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
