import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    // h-9 to match icon buttons and default buttons.
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-hairline bg-mist px-3.5 py-2 text-base text-ink transition-[background-color,border-color,box-shadow] duration-150 file:mr-3 file:h-full file:border-0 file:bg-transparent file:py-0 file:text-sm file:font-semibold file:text-teal-700 placeholder:text-muted-foreground hover:border-hairline-strong focus-visible:border-teal-600 focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
