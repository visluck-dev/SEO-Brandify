import type { Control, FieldPath } from "react-hook-form";

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ConsultationValues } from "./consultation-schema";

type Name = FieldPath<ConsultationValues>;

interface TextFieldProps {
  control: Control<ConsultationValues>;
  name: Exclude<Name, "cv" | "consent" | "experience" | "industry" | "preferredTime">;
  label: string;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
}

export function TextField({ control, name, label, placeholder, type = "text", autoComplete, hint, optional, className }: TextFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="font-display text-sm font-semibold text-ink">
            {label}
            {optional && <span className="ml-1.5 font-normal text-muted-foreground">(optional)</span>}
          </FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} autoComplete={autoComplete} {...field} value={field.value ?? ""} />
          </FormControl>
          {hint && <FormDescription className="text-xs">{hint}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface SelectFieldProps {
  control: Control<ConsultationValues>;
  name: "experience" | "industry" | "preferredTime";
  label: string;
  placeholder: string;
  options: readonly string[];
  className?: string;
}

export function SelectField({ control, name, label, placeholder, options, className }: SelectFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="font-display text-sm font-semibold text-ink">{label}</FormLabel>
          <Select name={field.name} onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="rounded-lg border-hairline shadow-panel">
              {options.map((o) => (
                <SelectItem key={o} value={o} className="rounded-md py-2.5 focus:bg-teal-50 focus:text-teal-700">
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
