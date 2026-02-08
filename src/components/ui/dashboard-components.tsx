import React from "react";
import { cn } from "@/lib/utils";

// --- CARD ---
export const Card = ({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm",
      className,
    )}
  >
    {children}
  </div>
);

// --- BUTTON ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "icon" | "secondary";
  size?: "sm" | "md" | "icon";
}
export const Button = ({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) => {
  const variants = {
    primary: "bg-teal-600 text-white hover:bg-teal-700 shadow-sm",
    outline: "border border-gray-200 bg-white hover:bg-gray-100 text-gray-900",
    ghost: "hover:bg-gray-100 text-gray-700",
    icon: "h-9 w-9 p-0",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
  };
  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    icon: "h-9 w-9",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
};

// --- INPUT ---
export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

// --- BADGE ---
export const Badge = ({
  children,
  className,
  variant = "gray",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "gray" | "teal" | "blue" | "orange" | "green";
}) => {
  const variants = {
    gray: "bg-gray-100 text-gray-800",
    teal: "bg-teal-50 text-teal-700",
    blue: "bg-blue-50 text-blue-700",
    orange: "bg-orange-50 text-orange-700",
    green: "bg-emerald-50 text-emerald-700",
  };
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none border-transparent",
        variants[variant],
        className,
      )}
    >
      {children}
    </div>
  );
};
