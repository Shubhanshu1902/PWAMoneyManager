import type { Source, TransactionType } from '../db/types';
import { SOURCES } from '../db/types';

export interface ParsedImportRow {
  line: number;
  date: string;
  type: TransactionType;
  amount: number;
  categoryName?: string;
  source: Source;
  toSource?: Source;
  note?: string;
}

export interface ImportParseResult {
  rows: ParsedImportRow[];
  errors: string[];
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      fields.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields.map((f) => f.trim());
}

function findSource(raw: string): Source | undefined {
  return SOURCES.find((s) => s.toLowerCase() === raw.toLowerCase());
}

export function parseImportCsv(text: string): ImportParseResult {
  const lines = text.split('\n').map((l) => l.replace(/\r$/, '')).filter((l) => l.trim().length > 0);
  const rows: ParsedImportRow[] = [];
  const errors: string[] = [];

  // First non-empty line is treated as the header and skipped.
  for (let i = 1; i < lines.length; i++) {
    const lineNumber = i + 1;
    const [date, typeRaw, amountRaw, categoryName, sourceRaw, toSourceRaw, note] = parseCsvLine(lines[i]);

    if (!ISO_DATE_RE.test(date ?? '')) {
      errors.push(`Line ${lineNumber}: invalid date "${date}" (expected YYYY-MM-DD)`);
      continue;
    }

    const type = (typeRaw ?? '').toLowerCase() as TransactionType;
    if (type !== 'expense' && type !== 'income' && type !== 'transfer') {
      errors.push(`Line ${lineNumber}: invalid type "${typeRaw}" (expected expense/income/transfer)`);
      continue;
    }

    const amount = parseFloat(amountRaw);
    if (!amount || amount <= 0) {
      errors.push(`Line ${lineNumber}: invalid amount "${amountRaw}"`);
      continue;
    }

    const source = findSource(sourceRaw ?? '');
    if (!source) {
      errors.push(`Line ${lineNumber}: unknown source "${sourceRaw}" (expected one of ${SOURCES.join(', ')})`);
      continue;
    }

    let toSource: Source | undefined;
    if (type === 'transfer') {
      toSource = findSource(toSourceRaw ?? '');
      if (!toSource) {
        errors.push(`Line ${lineNumber}: transfer missing valid "to" source "${toSourceRaw}"`);
        continue;
      }
      if (toSource === source) {
        errors.push(`Line ${lineNumber}: transfer "from" and "to" are the same account`);
        continue;
      }
    }

    rows.push({
      line: lineNumber,
      date,
      type,
      amount,
      categoryName: type !== 'transfer' && categoryName ? categoryName : undefined,
      source,
      toSource,
      note: note || undefined,
    });
  }

  return { rows, errors };
}
