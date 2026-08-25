import { NextResponse } from 'next/server';

let defaultBooks = [
  { id: 101, title: 'Software Engineering: Pressman', author: 'Roger S. Pressman', isIssued: false, issuedTo: null },
  { id: 102, title: 'Clean Architecture: C. Martin', author: 'Robert C. Martin', isIssued: true, issuedTo: '25/SE/127 (Paras Saini)' },
  { id: 103, title: 'Design Patterns: Gamma', author: 'Erich Gamma', isIssued: false, issuedTo: null },
];

let defaultHistory = [
  { logMessage: 'C++ Library System initialized with Persistent Local Storage.', time: 'Just now' }
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  if (type === 'history') {
    return NextResponse.json(defaultHistory);
  }
  return NextResponse.json(defaultBooks);
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ success: true, body });
}