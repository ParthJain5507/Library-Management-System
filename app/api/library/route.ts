import { NextResponse } from 'next/server';

let books = [
  { id: 101, title: 'Software Engineering: Pressman', author: 'Roger S. Pressman', isIssued: false, issuedTo: null },
  { id: 102, title: 'Clean Architecture: C. Martin', author: 'Robert C. Martin', isIssued: true, issuedTo: '25/SE/127 (Paras Saini)' },
  { id: 103, title: 'Design Patterns: Gamma', author: 'Erich Gamma', isIssued: false, issuedTo: null },
];

let history = [
  { logMessage: 'C++ Library System initialized via Next.js API Route.', time: 'Just now' }
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  if (type === 'history') {
    return NextResponse.json(history);
  }
  return NextResponse.json(books);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { action, id, title, author, student, bookId } = body;

  if (action === 'addBook') {
    if (books.some(b => b.id === Number(id))) {
      return NextResponse.json({ error: 'Book ID already exists in C++ Registry.' }, { status: 400 });
    }
    books.push({ id: Number(id), title, author, isIssued: false, issuedTo: null });
    history.unshift({ logMessage: `[C++ ADD] ID ${id}: ${title}`, time: new Date().toLocaleTimeString() });
    return NextResponse.json({ success: true });
  }

  if (action === 'issue' || action === 'return') {
    let book = books.find(b => b.id === Number(bookId));
    if (!book) return NextResponse.json({ error: 'Book not found.' }, { status: 404 });

    if (action === 'issue') {
      if (book.isIssued) return NextResponse.json({ error: 'Already issued.' }, { status: 400 });
      book.isIssued = true;
      book.issuedTo = `${student.id} (${student.name})`;
      history.unshift({ logMessage: `[C++ ISSUE] ID ${bookId} to ${student.id}`, time: new Date().toLocaleTimeString() });
    } else {
      if (!book.isIssued) return NextResponse.json({ error: 'Not issued.' }, { status: 400 });
      book.isIssued = false;
      book.issuedTo = null;
      history.unshift({ logMessage: `[C++ RETURN] ID ${bookId}`, time: new Date().toLocaleTimeString() });
    }
    return NextResponse.json({ success: true, book });
  }

  if (action === 'delete') {
    const initialLen = books.length;
    books = books.filter(b => b.id !== Number(bookId));
    if (books.length === initialLen) return NextResponse.json({ error: 'Book not found.' }, { status: 404 });
    history.unshift({ logMessage: `[C++ REMOVE] ID ${bookId}`, time: new Date().toLocaleTimeString() });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid Action' }, { status: 400 });
}