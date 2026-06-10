import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

export interface GlowInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const GlowInput = React.forwardRef<HTMLInputElement, GlowInputProps>(
  ({ className, error, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "w-full rounded-lg border bg-background/50 px-4 py-2.5 text-sm outline-none transition-all duration-300",
          "border-border focus:border-primary/50 focus:ring-3 focus:ring-primary/25",
          "placeholder:text-muted-foreground/60",
          error && "border-destructive focus:border-destructive focus:ring-destructive/25",
          className
        )}
        {...props}
      />
    );
  }
);
GlowInput.displayName = "GlowInput";

// Password input with show/hide toggle eye button
export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  error?: boolean;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, error, ...props }, ref) => {
    const [show, setShow] = useState(false);
    return (
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          ref={ref}
          className={cn(
            "w-full rounded-lg border bg-background/50 px-4 py-2.5 pr-11 text-sm outline-none transition-all duration-300",
            "border-border focus:border-primary/50 focus:ring-3 focus:ring-primary/25",
            "placeholder:text-muted-foreground/60",
            error && "border-destructive focus:border-destructive focus:ring-destructive/25",
            className
          )}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors duration-200 focus:outline-none"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export interface GlowTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const GlowTextarea = React.forwardRef<HTMLTextAreaElement, GlowTextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-lg border bg-background/50 px-4 py-2.5 text-sm outline-none transition-all duration-300 min-h-[100px] resize-y",
          "border-border focus:border-primary/50 focus:ring-3 focus:ring-primary/25",
          "placeholder:text-muted-foreground/60",
          error && "border-destructive focus:border-destructive focus:ring-destructive/25",
          className
        )}
        {...props}
      />
    );
  }
);
GlowTextarea.displayName = "GlowTextarea";
