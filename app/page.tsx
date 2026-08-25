'use client';
import React, { useState, useEffect } from 'react';

interface BookRecord {
  id: number;
  title: string;
  author: string;
  isIssued: boolean;
  issuedTo: string | null;
}

interface HistoryLog {
  logMessage: string;
  time: string;
}

export default function SELibrarySystem() {
  const [currentRole, setCurrentRole] = useState<'guest' | 'student' | 'admin'>('guest');
  const [activeTab, setActiveTab] = useState<'inventory' | 'transactions' | 'admin'>('inventory');
  
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [studentIdInput, setStudentIdInput] = useState('');
  const [studentPinInput, setStudentPinInput] = useState('');
  const [activeStudent, setActiveStudent] = useState<{ id: string; name: string } | null>(null);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');

  const [books, setBooks] = useState<BookRecord[]>([]);
  const [history, setHistory] = useState<HistoryLog[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [welcomeBanner, setWelcomeBanner] = useState<string | null>(null);

  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState<BookRecord | null | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  const fetchBooks = async () => {
    const res = await fetch('/api/library');
    const data = await res.json();
    setBooks(data);
  };

  const fetchHistory = async () => {
    const res = await fetch('/api/library?type=history');
    const data = await res.json();
    setHistory(data);
  };

  const DTU_SE_STUDENT_DATABASE = [
    { id: "25/SE/127", name: "Paras Saini", pin: "1111" },
    { id: "25/SE/128", name: "Parth Bedi", pin: "1111" },
    { id: "25/SE/129", name: "Parth Jain", pin: "1111" },
  ];

  useEffect(() => {
    setMounted(true);
    const savedStudent = localStorage.getItem('cpp_lib_student');
    if (savedStudent) {
      setActiveStudent(JSON.parse(savedStudent));
      setCurrentRole('student');
    }
    fetchBooks();
    fetchHistory();
  }, []);

  if (!mounted) return null;

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const triggerWelcomeBanner = (msg: string) => {
    setWelcomeBanner(msg);
    setTimeout(() => setWelcomeBanner(null), 4000);
  };

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedStudent = DTU_SE_STUDENT_DATABASE.find(
      s => s.id.toLowerCase() === studentIdInput.trim().toLowerCase() && s.pin === studentPinInput.trim()
    );

    if (!matchedStudent) {
      showNotification('Authorization Failed: Invalid SE Roll Number or PIN.');
      setStudentPinInput('');
      return;
    }

    setActiveStudent({ id: matchedStudent.id, name: matchedStudent.name });
    setCurrentRole('student');
    localStorage.setItem('cpp_lib_student', JSON.stringify({ id: matchedStudent.id, name: matchedStudent.name }));
    setShowStudentModal(false);
    setStudentIdInput('');
    setStudentPinInput('');
    triggerWelcomeBanner(`Authenticated as ${matchedStudent.name} (${matchedStudent.id})`);
  };

  const handleStudentLogout = () => {
    setActiveStudent(null);
    setCurrentRole('guest');
    localStorage.removeItem('cpp_lib_student');
    showNotification('Student session terminated.');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasscode === 'admin123') {
      setIsAdminAuthenticated(true);
      setCurrentRole('admin');
      setActiveTab('admin');
      setShowAdminModal(false);
      setAdminPasscode('');
      showNotification('Administrator privileges granted.');
    } else {
      showNotification('Incorrect admin passcode.');
      setAdminPasscode('');
    }
  };

  const handleAction = async (action: string, payload: any) => {
    if (action === 'addBook' || action === 'deleteBook') {
      if (currentRole !== 'admin' || !isAdminAuthenticated) {
        setShowAdminModal(true);
        showNotification('Admin authorization required.');
        return;
      }
    }

    if (action === 'issueBook' || action === 'returnBook') {
      if (!activeStudent || currentRole !== 'student') {
        setShowStudentModal(true);
        showNotification('Student authentication required.');
        return;
      }
    }

    if (action === 'addBook') {
      const res = await fetch('/api/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addBook', ...payload })
      });
      const data = await res.json();
      if (data.error) { showNotification(data.error); return; }
      
      setId(''); setTitle(''); setAuthor('');
      showNotification('Record added to registry.');
      fetchBooks();
      fetchHistory();
    } 
    else if (action === 'deleteBook') {
      const res = await fetch('/api/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', bookId: payload.id })
      });
      const data = await res.json();
      if (data.error) { showNotification(data.error); return; }
      
      showNotification('Record removed.');
      fetchBooks();
      fetchHistory();
    } 
    else if (action === 'issueBook' || action === 'returnBook') {
      const res = await fetch('/api/library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: action === 'issueBook' ? 'issue' : 'return', bookId: payload.id, student: activeStudent })
      });
      const data = await res.json();
      if (data.error) { showNotification(data.error); return; }

      showNotification(`Book transaction completed successfully.`);
      fetchBooks();
      fetchHistory();
    }
  };

  const handleSearch = () => {
    const targetId = Number(searchId);
    if (!targetId) return;

    let sortedBooks = [...books].sort((a, b) => a.id - b.id);
    let left = 0, right = sortedBooks.length - 1;
    let found: BookRecord | null = null;

    while (left <= right) {
      let mid = Math.floor((left + right) / 2);
      if (sortedBooks[mid].id === targetId) { found = sortedBooks[mid]; break; }
      if (sortedBooks[mid].id < targetId) left = mid + 1;
      else right = mid - 1;
    }
    setSearchResult(found);
  };

  const issuedCount = books.filter(b => b.isIssued).length;
  const availableCount = books.length - issuedCount;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 font-sans flex flex-col justify-between selection:bg-zinc-700 selection:text-zinc-100">
      
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#18181b] border border-zinc-800 text-zinc-200 text-xs px-4 py-3 rounded shadow-lg tracking-wide">
          {notification}
        </div>
      )}

      {welcomeBanner && (
        <div className="fixed top-4 right-4 z-50 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs px-4 py-2.5 rounded shadow">
          {welcomeBanner}
        </div>
      )}

      {showStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#121215] border border-zinc-800 rounded-lg p-6 max-w-sm w-full space-y-5">
            <div>
              <h2 className="text-sm font-medium text-zinc-100 tracking-wide">Student Authentication</h2>
              <p className="text-[11px] text-zinc-500 mt-0.5">Enter department credentials to proceed.</p>
            </div>
            <form onSubmit={handleStudentLogin} className="space-y-3">
              <input type="text" placeholder="Roll No (e.g. 25/SE/127)" value={studentIdInput} onChange={e => setStudentIdInput(e.target.value)} className="w-full bg-[#18181b] border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600" required />
              <input type="password" placeholder="PIN (1111)" value={studentPinInput} onChange={e => setStudentPinInput(e.target.value)} className="w-full bg-[#18181b] border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600" required />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowStudentModal(false)} className="flex-1 bg-zinc-800 text-zinc-300 py-2 rounded text-xs hover:bg-zinc-700">Cancel</button>
                <button type="submit" className="flex-1 bg-zinc-200 text-zinc-950 py-2 rounded text-xs font-medium hover:bg-white">Authenticate</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#121215] border border-zinc-800 rounded-lg p-6 max-w-sm w-full space-y-5">
            <div>
              <h2 className="text-sm font-medium text-zinc-100 tracking-wide">Administrator Access</h2>
              <p className="text-[11px] text-zinc-500 mt-0.5">Enter master passcode.</p>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-3">
              <input type="password" placeholder="Passcode (admin123)" value={adminPasscode} onChange={e => setAdminPasscode(e.target.value)} className="w-full bg-[#18181b] border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600" required />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAdminModal(false)} className="flex-1 bg-zinc-800 text-zinc-300 py-2 rounded text-xs hover:bg-zinc-700">Cancel</button>
                <button type="submit" className="flex-1 bg-zinc-200 text-zinc-950 py-2 rounded text-xs font-medium hover:bg-white">Verify</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div>
        <header className="border-b border-zinc-800/80 bg-[#0c0c0e] px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
              <span className="text-[11px] uppercase tracking-widest text-zinc-500 font-mono">DTU SE Department</span>
            </div>
            <h1 className="text-lg font-medium text-zinc-100 tracking-tight mt-1">Library Management System</h1>
          </div>

          <div className="flex items-center gap-3">
            {currentRole === 'student' ? (
              <div className="flex items-center gap-3 bg-[#121215] border border-zinc-800 px-3 py-1.5 rounded text-xs">
                <span className="text-zinc-300">{activeStudent?.name}</span>
                <button onClick={handleStudentLogout} className="text-zinc-500 hover:text-zinc-300">Logout</button>
              </div>
            ) : (
              <button onClick={() => setShowStudentModal(true)} className="text-xs bg-[#18181b] border border-zinc-800 text-zinc-300 px-3.5 py-1.5 rounded hover:bg-zinc-800 transition">
                Student Login
              </button>
            )}

            <button onClick={() => isAdminAuthenticated ? (setCurrentRole('admin'), setActiveTab('admin')) : setShowAdminModal(true)} className="text-xs bg-[#18181b] border border-zinc-800 text-zinc-300 px-3.5 py-1.5 rounded hover:bg-zinc-800 transition">
              {isAdminAuthenticated ? 'Admin Panel' : 'Admin Login'}
            </button>
          </div>
        </header>

        <nav className="border-b border-zinc-800/80 bg-[#0a0a0c] px-8 flex gap-6 text-xs">
          <button onClick={() => setActiveTab('inventory')} className={`py-3.5 border-b ${activeTab === 'inventory' ? 'border-zinc-300 text-zinc-100 font-medium' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>Catalog</button>
          <button onClick={() => setActiveTab('transactions')} className={`py-3.5 border-b ${activeTab === 'transactions' ? 'border-zinc-300 text-zinc-100 font-medium' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>Transaction History</button>
          {currentRole === 'admin' && isAdminAuthenticated && (
            <button onClick={() => setActiveTab('admin')} className={`py-3.5 border-b ${activeTab === 'admin' ? 'border-zinc-300 text-zinc-100 font-medium' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>Admin Controls</button>
          )}
        </nav>

        <main className="max-w-6xl mx-auto p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#121215] border border-zinc-800/80 p-5 rounded">
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-mono">Total Registry</span>
              <p className="text-2xl font-normal text-zinc-100 mt-1 font-mono">{books.length}</p>
            </div>
            <div className="bg-[#121215] border border-zinc-800/80 p-5 rounded">
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-mono">Available</span>
              <p className="text-2xl font-normal text-zinc-200 mt-1 font-mono">{availableCount}</p>
            </div>
            <div className="bg-[#121215] border border-zinc-800/80 p-5 rounded">
              <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-mono">Issued Out</span>
              <p className="text-2xl font-normal text-zinc-400 mt-1 font-mono">{issuedCount}</p>
            </div>
          </div>

          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="bg-[#121215] border border-zinc-800/80 p-5 rounded flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="flex gap-2 w-full sm:w-auto">
                  <input type="number" placeholder="Enter Book ID..." value={searchId} onChange={e => setSearchId(e.target.value)} className="bg-[#18181b] border border-zinc-800 rounded px-3 py-1.5 text-xs text-zinc-200 w-full sm:w-56 focus:outline-none focus:border-zinc-600 font-mono" />
                  <button onClick={handleSearch} className="bg-zinc-800 text-zinc-300 text-xs px-4 py-1.5 rounded hover:bg-zinc-700 transition">Search</button>
                </div>
                {searchResult !== undefined && (
                  <div className="text-xs text-zinc-400 font-mono">
                    {searchResult ? `Match: [${searchResult.id}] ${searchResult.title}` : 'Status: Record not found.'}
                  </div>
                )}
              </div>

              <div className="bg-[#121215] border border-zinc-800/80 rounded overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500 font-mono uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-5">ID</th>
                      <th className="py-3 px-5">Title</th>
                      <th className="py-3 px-5">Author</th>
                      <th className="py-3 px-5">Status</th>
                      <th className="py-3 px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {books.map(b => (
                      <tr key={b.id} className="hover:bg-zinc-900/40 transition">
                        <td className="py-3.5 px-5 font-mono text-zinc-400">{b.id}</td>
                        <td className="py-3.5 px-5 text-zinc-200 font-medium">{b.title}</td>
                        <td className="py-3.5 px-5 text-zinc-400">{b.author}</td>
                        <td className="py-3.5 px-5">
                          <span className={`inline-block text-[10px] px-2 py-0.5 rounded font-mono ${b.isIssued ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-800/50 text-zinc-300'}`}>
                            {b.isIssued ? `Issued: ${b.issuedTo}` : 'Available'}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          {!b.isIssued ? (
                            <button onClick={() => handleAction('issueBook', { id: b.id })} className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded text-[11px] hover:bg-zinc-700 transition">Issue</button>
                          ) : (
                            <button onClick={() => handleAction('returnBook', { id: b.id })} className="border border-zinc-700 text-zinc-400 px-3 py-1 rounded text-[11px] hover:bg-zinc-800 transition">Return</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="bg-[#121215] border border-zinc-800/80 p-6 rounded space-y-3">
              <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-4">Linked List Audit Log</h2>
              <div className="space-y-2">
                {history.map((h, index) => (
                  <div key={index} className="p-3 bg-[#18181b] border border-zinc-800/60 rounded text-xs flex justify-between items-center font-mono">
                    <span className="text-zinc-300">{h.logMessage}</span>
                    <span className="text-zinc-600 text-[11px]">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'admin' && currentRole === 'admin' && isAdminAuthenticated && (
            <div className="bg-[#121215] border border-zinc-800/80 p-6 rounded space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500">Insert New Record</h2>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input type="number" placeholder="Book ID" value={id} onChange={e => setId(e.target.value)} className="bg-[#18181b] border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 font-mono" />
                <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="bg-[#18181b] border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600" />
                <input type="text" placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} className="bg-[#18181b] border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600" />
                <button onClick={() => handleAction('addBook', { id, title, author })} className="bg-zinc-200 text-zinc-950 font-medium text-xs py-2 rounded hover:bg-white transition">Commit Record</button>
              </div>
            </div>
          )}

        </main>
      </div>

      <footer className="border-t border-zinc-800/80 bg-[#0c0c0e] px-8 py-4 text-xs text-zinc-600 flex justify-between font-mono">
        <p>© 2026 Delhi Technological University</p>
        <p>Engineered Systems Interface</p>
      </footer>
    </div>
  );
}