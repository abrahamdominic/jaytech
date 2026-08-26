import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  showLine?: boolean;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  centered = true,
  showLine = true,
  className,
  titleClassName,
  subtitleClassName,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-12",
        centered && "text-center",
        className
      )}
    >
      <h2
        className={cn(
          "text-3xl font-bold tracking-tight text-secondary sm:text-4xl lg:text-5xl",
          titleClassName
        )}
      >
        {title}
      </h2>
      {showLine && (
        <div className={cn("mt-4 flex items-center gap-3", centered && "justify-center")}>
          <div className="h-1 w-12 rounded-full bg-primary" />
          <div className="h-1 w-6 rounded-full opacity-50 bg-primary" />
          <div className="h-1 w-3 rounded-full opacity-30 bg-primary" />
        </div>
      )}
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-lg text-muted max-w-2xl",
            centered && "mx-auto",
            subtitleClassName
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
