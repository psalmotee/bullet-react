import { forwardRef } from "react";

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      disabled = false,
      loading = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center gap-1 font-medium rounded-md transition-all duration-300 ease-in-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary: "bg-gray-900 text-white hover:bg-gray-700",
      secondary: "bg-white text-black border border-gray-300 hover:bg-gray-100",
      danger: "bg-red-500 text-white hover:bg-red-400",
      ghost:
        "bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-9 px-4 py-2 text-sm",
      lg: "h-10 px-6 text-base",
    };

    const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="loading loading-spinner loading-xs text-current opacity-50"></span>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
