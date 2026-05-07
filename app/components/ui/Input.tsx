import { InputHTMLAttributes, forwardRef } from "react";
import { LucideIcon } from "lucide-react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", icon: Icon, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-4 py-2 bg-white border ${
            error ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500/10'
          } rounded-md focus:ring-4 outline-none transition-all text-sm shadow-sm ${className}`}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";
