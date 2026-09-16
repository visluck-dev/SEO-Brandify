import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "header" | "footer" | "nav";
}

export function Container({ as: Tag = "div", className, ...props }: ContainerProps) {
  return <Tag className={cn("container-x", className)} {...props} />;
}
