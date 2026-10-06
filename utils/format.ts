export function formatUSD(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function cartCount(lines: { qty: number }[]): number {
  return lines.reduce((sum, l) => sum + l.qty, 0);
}
