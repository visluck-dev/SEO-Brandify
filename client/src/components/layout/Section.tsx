import { cn } from "@/lib/utils";
import { Container } from "./Container";

type Tone = "paper" | "mist" | "navy";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  tone?: Tone;
  /** Tighter vertical rhythm for strips (trust bar, metrics). */
  compact?: boolean;
  containerClassName?: string;
}

const tones: Record<Tone, string> = {
  paper: "bg-white",
  mist: "bg-mist",
  navy: "bg-ink text-white",
};

export function Section({ tone = "paper", compact = false, className, containerClassName, children, ...props }: SectionProps) {
  return (
    <section className={cn(tones[tone], compact ? "py-10 md:py-14" : "section-y", className)} {...props}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  onNavy?: boolean;
  className?: string;
  titleAs?: "h1" | "h2";
}

export function SectionHeader({ eyebrow, title, lead, align = "left", onNavy = false, className, titleAs: Title = "h2" }: SectionHeaderProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className={cn("mb-4", onNavy ? "eyebrow-on-navy" : "eyebrow")}>{eyebrow}</p>}
      <Title className={cn("h-section", onNavy && "text-white")}>{title}</Title>
      {lead && <p className={cn("lead mt-5", onNavy && "text-white/75")}>{lead}</p>}
    </div>
  );
}
