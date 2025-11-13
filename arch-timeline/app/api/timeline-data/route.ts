
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Helper to map a sheet's rows to objects using the header row
function mapSheetRows(values: string[][]) {
  if (!values || values.length < 2) return [];
  const headers = values[0];
  return values.slice(1).map(row => {
    const obj: Record<string, string> = {};
    headers.forEach((header, i) => {
      obj[header] = row[i] || '';
    });
    return obj;
  });
}

export async function GET() {
  try {
    // Get credentials - handle both file path and JSON string
    let credentials;
    const credEnv = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    
    if (!credEnv) {
      return NextResponse.json(
        { error: 'Missing Google credentials' },
        { status: 500 }
      );
    }

    // Check if it's a file path or JSON string
    if (credEnv.startsWith('./') || credEnv.startsWith('/')) {
      // It's a file path
      const filePath = path.resolve(process.cwd(), credEnv);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      credentials = JSON.parse(fileContent);
    } else {
      // It's a JSON string
      credentials = JSON.parse(credEnv);
    }

    const authClient = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });
    
    await authClient.authorize();
    const sheets = google.sheets({ version: 'v4', auth: authClient });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Sheet/tab names based on your workbook
    const tabNames = ['Macros', 'Movements', 'Buildings', 'Figures'];
    const data: Record<string, Record<string, string>[]> = {};

    for (const tab of tabNames) {
      const range = `${tab}!A:Z`;
      const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
      data[tab] = mapSheetRows(res.data.values as string[][]);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching timeline data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timeline data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
