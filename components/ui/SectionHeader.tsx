import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

import { Badge } from "./Badge";
import { Heading } from "./Heading";
import { editorialSpacing } from "./editorial";

export type SectionHeaderLayout = "stacked" | "split" | "editorial";
export type SectionHeaderAlign = "start" | "center" | "end";

export type SectionHeaderProps = Omit<
  HTMLAttributes<HTMLElement>,
  "children" | "title"
> & {
  badge?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: SectionHeaderAlign;
  layout?: SectionHeaderLayout;
  actions?: ReactNode;
  children?: ReactNode;
  headingId?: string;
  headingLevel?: 1 | 2 | 3;
};

const alignClasses: Record<SectionHeaderAlign, string> = {
  start: "items-start text-start",
  center: "items-center text-center",
  end: "items-end text-end",
};

const layoutClasses: Record<SectionHeaderLayout, string> = {
  stacked: editorialSpacing.sectionHeaderStack,
  split: editorialSpacing.sectionHeaderSplit,
  editorial: cn(
    editorialSpacing.sectionHeaderStack,
    editorialSpacing.sectionHeaderEditorial,
  ),
};

export function SectionHeader({
  badge,
  title,
  description,
  align = "start",
  layout = "stacked",
  actions,
  children,
  headingId,
  headingLevel = 2,
  className,
  ...props
}: SectionHeaderProps) {
  const content = (
    <div
      className={cn(
        "flex flex-col gap-[var(--space-5)]",
        layout !== "split" && alignClasses[align],
      )}
    >
      {badge ? (
        <Badge variant="red" size="md">
          {badge}
        </Badge>
      ) : null}

      <div className="flex flex-col gap-[var(--space-4)]">
        <Heading id={headingId} level={headingLevel}>
          {title}
        </Heading>
        {description ? (
          <p className={editorialSpacing.prose}>{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );

  if (layout === "split") {
    const headingContent = (
      <div className="flex flex-col items-start gap-[var(--space-5)] text-start">
        {badge ? (
          <Badge variant="red" size="md">
            {badge}
          </Badge>
        ) : null}

        <div className="flex flex-col gap-[var(--space-4)]">
          <Heading id={headingId} level={headingLevel}>
            {title}
          </Heading>
          {description && actions ? (
            <p className={editorialSpacing.prose}>{description}</p>
          ) : null}
        </div>
        {children}
      </div>
    );

    return (
      <header className={cn(layoutClasses[layout], className)} {...props}>
        {headingContent}
        {actions ? (
          <div className="flex items-start justify-start lg:justify-end">
            {actions}
          </div>
        ) : description ? (
          <p className={editorialSpacing.prose}>{description}</p>
        ) : null}
      </header>
    );
  }

  return (
    <header className={cn(layoutClasses[layout], alignClasses[align], className)} {...props}>
      {content}
      {actions}
    </header>
  );
}
