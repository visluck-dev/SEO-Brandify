export const selectClass = "h-10 w-full rounded-lg border border-hairline bg-mist px-3 text-sm text-ink focus:bg-white";
export const labelClass = "block text-xs font-semibold text-ink";

/** datetime-local value two days out at 10:00, from the console clock. */
export function defaultSlot(now: string): string {
  const d = new Date(new Date(now).getTime() + 2 * 86_400_000);
  return `${d.toISOString().slice(0, 10)}T10:00`;
}
