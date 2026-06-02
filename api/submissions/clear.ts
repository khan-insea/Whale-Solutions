import { writeSubmissions } from '../_storage';

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  try {
    writeSubmissions([]);
    res.status(200).json({ success: true, message: 'Submissions cleared successfully' });
  } catch (error: any) {
    console.error('Clear submissions error:', error);
    res.status(500).json({ success: false, error: 'Cannot clear submissions' });
  }
}
