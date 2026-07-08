export const editorialSpacing = {
  sectionStack: "flex flex-col gap-[var(--space-10)] md:gap-[var(--space-12)]",
  sectionHeaderStack:
    "flex max-w-[var(--container-narrow)] flex-col items-start gap-[var(--space-5)] text-start",
  sectionHeaderSplit:
    "grid gap-[var(--space-8)] lg:grid-cols-[0.82fr_1.18fr] lg:items-end",
  sectionHeaderEditorial:
    "border-s border-red-primary/50 ps-[var(--space-5)]",
  heroShell:
    "overflow-hidden pt-[calc(var(--space-20)+var(--space-8))] md:pt-[calc(var(--space-20)+var(--space-16))]",
  heroStack: "flex flex-col gap-[var(--space-10)] md:gap-[var(--space-12)]",
  heroGrid: "grid gap-[var(--space-10)] md:gap-[var(--space-12)] lg:items-end",
  prose: "max-w-[var(--container-narrow)] text-body-lg text-text-secondary rtl:text-ar-body-lg",
} as const;
