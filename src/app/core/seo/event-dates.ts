const MONTHS: Record<string, number> = {
  janvier: 1, janv: 1,
  fevrier: 2, fevr: 2, fev: 2,
  mars: 3,
  avril: 4, avr: 4,
  mai: 5,
  juin: 6,
  juillet: 7, juil: 7,
  aout: 8,
  septembre: 9, sept: 9,
  octobre: 10, oct: 10,
  novembre: 11, nov: 11,
  decembre: 12, dec: 12,
};

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Parses the French date labels used on the site into ISO dates for schema.org:
 * “Dimanche 6 décembre 2026”, “11 au 25 Octobre 2026”, “Du 28 au 29 Nov. 2026”,
 * “26 au 28 février 2027”. Returns null for month-only labels such as “Mars 2026”.
 */
export function parseEventDates(label: string): { start: string; end: string } | null {
  const text = label
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\./g, '');
  const match = text.match(/(\d{1,2})(?:\s*(?:au|-)\s*(\d{1,2}))?\s+([a-z]+)\s+(\d{4})/);
  if (!match) return null;
  const [, d1, d2, monthName, year] = match;
  const month = MONTHS[monthName];
  if (!month) return null;
  const start = `${year}-${pad(month)}-${pad(+d1)}`;
  const end = `${year}-${pad(month)}-${pad(+(d2 ?? d1))}`;
  return { start, end };
}
