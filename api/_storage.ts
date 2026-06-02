import fs from 'fs';
import path from 'path';

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';
const DATA_DIR = isVercel ? path.join('/tmp', 'whale-solutions-data') : path.join(process.cwd(), 'data');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');

export function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(SUBMISSIONS_FILE)) {
    fs.writeFileSync(SUBMISSIONS_FILE, '[]', 'utf-8');
  }
}

export function readSubmissions() {
  try {
    ensureDataFile();
    const fileContent = fs.readFileSync(SUBMISSIONS_FILE, 'utf-8');
    return JSON.parse(fileContent) as any[];
  } catch (error) {
    return [];
  }
}

export function writeSubmissions(submissions: any[]) {
  ensureDataFile();
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2), 'utf-8');
}
