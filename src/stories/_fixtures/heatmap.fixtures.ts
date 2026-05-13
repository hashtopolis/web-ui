type HeatmapCell = [string, number];

const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const dateOffset = (offsetDays: number): string => {
  const d = today();
  d.setDate(d.getDate() - offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const EMPTY: HeatmapCell[] = [];

export const SPARSE: HeatmapCell[] = [
  [dateOffset(2), 3],
  [dateOffset(5), 8],
  [dateOffset(11), 1],
  [dateOffset(30), 12],
  [dateOffset(60), 4],
  [dateOffset(120), 2]
];

// Dense: 52 weeks × 7 days, oscillating counts so the bucket gradient shows.
export const DENSE_FULL_YEAR: HeatmapCell[] = Array.from({ length: 52 * 7 }, (_, i) => {
  const count = Math.round(Math.abs(Math.sin(i / 4) + Math.cos(i / 11)) * 8);
  return [dateOffset(52 * 7 - 1 - i), count] as HeatmapCell;
}).filter(([, n]) => n > 0);

export const SHORT_12_WEEKS: HeatmapCell[] = Array.from({ length: 12 * 7 }, (_, i) => {
  const count = i % 3 === 0 ? Math.floor((i % 9) + 1) : 0;
  return [dateOffset(12 * 7 - 1 - i), count] as HeatmapCell;
}).filter(([, n]) => n > 0);
