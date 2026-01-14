import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function Checkbox({
  className,
  label,
  id,
  checked,
  onChange,
  ...props
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex items-center gap-3 cursor-pointer group",
        className
      )}
    >
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
          {...props}
        />
        <div className={cn(
          "w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center",
          checked
            ? "bg-primary border-primary"
            : "border-input group-hover:border-primary/50"
        )}>
          {checked && (
            <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />
          )}
        </div>
      </div>
      {label && (
        <span className="text-sm font-medium text-foreground select-none">
          {label}
        </span>
      )}
    </label>
  );
}
