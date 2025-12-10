// src/components/utils.ts

// Simple className combiner, similar to shadcn's cn helper.
// Usage: cn("base", condition && "optional", anotherCondition && "other")
export function cn(
  ...values: Array<string | number | false | null | undefined>
): string {
  return values
    .flatMap((value) => {
      if (!value && value !== 0) return [];
      return String(value).split(" ");
    })
    .filter(Boolean)
    .join(" ");
}
