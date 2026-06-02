import { readSubmissions } from './_storage';

export default function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  try {
    const submissions = readSubmissions();
    res.status(200).json({ success: true, submissions });
  } catch (error: any) {
    console.error('Read submissions error:', error);
    res.status(500).json({ success: false, error: 'Cannot read submissions data' });
  }
}
