import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = forwardRef(
  (
    { label, error, required = false, className = "", type = "text", ...props },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    const baseClasses =
      "block w-full px-3 py-1 h-9 border border-gray-300 rounded-md focus:outline-none focus:ring-sky-500 focus:border-sky-500 disabled:bg-gray-50 disabled:text-gray-500";

    return (
      <div className="grid grid-cols-1 gap-1 w-full">
        {label && (
          <label className="text-sm font-medium">
            <span
              className={
                required
                  ? "after:ml-0.5 after:text-red-500 after:content-['*']"
                  : ""
              }
            >
              {label}
            </span>
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            type={isPassword && showPassword ? "text" : type}
            className={`${baseClasses} ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                : ""
            } ${className} pr-10`}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
