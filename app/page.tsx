'use client';
import React, { useState, useEffect } from 'react';

interface BookRecord {
  id: number;
  title: string;
  author: string;
  isIssued: boolean;
  issuedTo: string | null;
  issuedDate?: string;
  returnDate?: string;
}

interface HistoryLog {
  logMessage: string;
  time: string;
}

export default function SELibrarySystem() {
  const [currentRole, setCurrentRole] = useState<'guest' | 'student' | 'admin'>('guest');
  const [activeTab, setActiveTab] = useState<'inventory' | 'dashboard' | 'transactions' | 'admin'>('inventory');
  
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

    const storedBooks = localStorage.getItem('cpp_lib_books');
    if (storedBooks) {
      setBooks(JSON.parse(storedBooks));
    } else {
      const initialBooks: BookRecord[] = [
        { id: 101, title: 'Software Engineering: Pressman', author: 'Roger S. Pressman', isIssued: false, issuedTo: null },
        { id: 102, title: 'Clean Architecture: C. Martin', author: 'Robert C. Martin', isIssued: true, issuedTo: '25/SE/127 (Paras Saini)', issuedDate: '2026-08-01', returnDate: '2026-09-01' },
        { id: 103, title: 'Design Patterns: Gamma', author: 'Erich Gamma', isIssued: false, issuedTo: null },
        { id: 104, title: 'Introduction to Algorithms (CLRS)', author: 'Thomas H. Cormen', isIssued: false, issuedTo: null },
        { id: 105, title: 'Operating System Concepts', author: 'Abraham Silberschatz', isIssued: true, issuedTo: '25/SE/128 (Parth Bedi)', issuedDate: '2026-08-05', returnDate: '2026-09-05' },
        { id: 106, title: 'Computer Networks', author: 'Andrew S. Tanenbaum', isIssued: false, issuedTo: null },
        { id: 107, title: 'Database System Concepts', author: 'Avi Silberschatz', isIssued: false, issuedTo: null },
        { id: 108, title: 'Compilers: Principles & Tools', author: 'Alfred V. Aho', isIssued: false, issuedTo: null },
        { id: 109, title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell', isIssued: false, issuedTo: null },
        { id: 110, title: 'Computer Organization and Design', author: 'David A. Patterson', isIssued: true, issuedTo: '25/SE/129 (Parth Jain)', issuedDate: '2026-08-10', returnDate: '2026-09-10' },
        { id: 111, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', isIssued: false, issuedTo: null },
        { id: 112, title: 'Code Complete', author: 'Steve McConnell', isIssued: false, issuedTo: null },
        { id: 113, title: 'Refactoring', author: 'Martin Fowler', isIssued: false, issuedTo: null },
        { id: 114, title: 'Domain-Driven Design', author: 'Eric Evans', isIssued: false, issuedTo: null },
        { id: 115, title: 'Head First Design Patterns', author: 'Eric Freeman', isIssued: false, issuedTo: null },
        { id: 116, title: 'Effective C++', author: 'Scott Meyers', isIssued: false, issuedTo: null },
        { id: 117, title: 'The C++ Programming Language', author: 'Bjarne Stroustrup', isIssued: false, issuedTo: null },
        { id: 118, title: 'Data Structures and Algorithm Analysis in C++', author: 'Mark Allen Weiss', isIssued: false, issuedTo: null },
        { id: 119, title: 'TCP/IP Illustrated, Volume 1', author: 'W. Richard Stevens', isIssued: false, issuedTo: null },
        { id: 120, title: 'Modern Operating Systems', author: 'Andrew S. Tanenbaum', isIssued: false, issuedTo: null },
        { id: 121, title: 'Web Engineering', author: 'Roger S. Pressman', isIssued: false, issuedTo: null },
        { id: 122, title: 'Distributed Systems', author: 'George Coulouris', isIssued: false, issuedTo: null },
        { id: 123, title: 'Cryptography and Network Security', author: 'William Stallings', isIssued: false, issuedTo: null },
        { id: 124, title: 'Computer Graphics: C Version', author: 'Donald Hearn', isIssued: false, issuedTo: null },
        { id: 125, title: 'Neural Networks and Deep Learning', author: 'Charu C. Aggarwal', isIssued: false, issuedTo: null },
        { id: 126, title: 'System Design Interview', author: 'Alex Xu', isIssued: false, issuedTo: null },
        { id: 127, title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', isIssued: false, issuedTo: null },
        { id: 128, title: 'The Mythical Man-Month', author: 'Frederick P. Brooks Jr.', isIssued: false, issuedTo: null },
      ];
      setBooks(initialBooks);
      localStorage.setItem('cpp_lib_books', JSON.stringify(initialBooks));
    }

    const storedHistory = localStorage.getItem('cpp_lib_history');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    } else {
      const initialHistory: HistoryLog[] = [
        { logMessage: 'C++ Library System initialized with Local Storage Persistence.', time: 'Just now' }
      ];
      setHistory(initialHistory);
      localStorage.setItem('cpp_lib_history', JSON.stringify(initialHistory));
    }
  }, []);

  if (!mounted) return null;

  const updateBooksStorage = (updatedBooks: BookRecord[]) => {
    setBooks(updatedBooks);
    localStorage.setItem('cpp_lib_books', JSON.stringify(updatedBooks));
  };

  const updateHistoryStorage = (newLog: string) => {
    const newHistoryLog = { logMessage: newLog, time: new Date().toLocaleTimeString() };
    setHistory(prev => {
      const updated = [newHistoryLog, ...prev];
      localStorage.setItem('cpp_lib_history', JSON.stringify(updated));
      return updated;
    });
  };

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
    setActiveTab('inventory');
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
        showNotification('Student authentication required to issue/return.');
        return;
      }
    }

    if (action === 'addBook') {
      const { id: newId, title: newTitle, author: newAuthor } = payload;
      if (!newId || !newTitle || !newAuthor) {
        showNotification('Please fill in all book fields.');
        return;
      }
      if (books.some(b => b.id === Number(newId))) {
        showNotification('Book ID already exists in Registry.');
        return;
      }
      const updated = [...books, { id: Number(newId), title: newTitle, author: newAuthor, isIssued: false, issuedTo: null }];
      updateBooksStorage(updated);
      updateHistoryStorage(`[ADMIN ADD] ID ${newId}: ${newTitle}`);

      setId(''); setTitle(''); setAuthor('');
      showNotification('New book added to registry.');
    } 
    else if (action === 'deleteBook') {
      const targetId = payload.id;
      const targetBook = books.find(b => b.id === Number(targetId));
      const updated = books.filter(b => b.id !== Number(targetId));
      
      updateBooksStorage(updated);
      updateHistoryStorage(`[ADMIN REMOVE] ID ${targetId} (${targetBook?.title || 'Book'}) deleted from registry`);
      showNotification('Book removed from registry by Admin.');
    } 
    else if (action === 'issueBook' || action === 'returnBook') {
      const targetId = payload.id;
      
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const issueDateStr = `${year}-${month}-${day}`;

      const returnDateObj = new Date(now);
      returnDateObj.setMonth(returnDateObj.getMonth() + 1);
      const retYear = returnDateObj.getFullYear();
      const retMonth = String(returnDateObj.getMonth() + 1).padStart(2, '0');
      const retDay = String(returnDateObj.getDate()).padStart(2, '0');
      const returnDateStr = `${retYear}-${retMonth}-${retDay}`;

      let updated = books.map(b => {
        if (b.id === Number(targetId)) {
          if (action === 'issueBook') {
            if (b.isIssued) return b;
            return { 
              ...b, 
              isIssued: true, 
              issuedTo: `${activeStudent?.id} (${activeStudent?.name})`,
              issuedDate: issueDateStr,
              returnDate: returnDateStr
            };
          } else {
            if (!b.isIssued) return b;
            if (activeStudent && !b.issuedTo?.includes(activeStudent.id)) {
              return b;
            }
            return { ...b, isIssued: false, issuedTo: null, issuedDate: undefined, returnDate: undefined };
          }
        }
        return b;
      });

      updateBooksStorage(updated);
      if (action === 'issueBook') {
        updateHistoryStorage(`[STUDENT ISSUE] Book ID ${targetId} issued on ${issueDateStr} to ${activeStudent?.id}`);
      } else {
        updateHistoryStorage(`[STUDENT RETURN] Book ID ${targetId} returned by ${activeStudent?.id}`);
      }
      showNotification(`Book transaction completed successfully!`);
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
  const myIssuedBooks = activeStudent ? books.filter(b => b.isIssued && b.issuedTo?.includes(activeStudent.id)) : [];
  const allIssuedBooks = books.filter(b => b.isIssued);

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
              <p className="text-[11px] text-zinc-500 mt-0.5">Enter department credentials to issue books.</p>
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
              <p className="text-[11px] text-zinc-500 mt-0.5">Enter master passcode to manage registry.</p>
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
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] uppercase tracking-widest text-zinc-400 font-mono">DTU SE Department — Core Architecture</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400">
              Library Management System
            </h1>
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
          {currentRole === 'student' && (
            <button onClick={() => setActiveTab('dashboard')} className={`py-3.5 border-b ${activeTab === 'dashboard' ? 'border-zinc-300 text-zinc-100 font-medium' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>My Dashboard</button>
          )}
          <button onClick={() => setActiveTab('transactions')} className={`py-3.5 border-b ${activeTab === 'transactions' ? 'border-zinc-300 text-zinc-100 font-medium' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>Transaction History</button>
          {currentRole === 'admin' && isAdminAuthenticated && (
            <button onClick={() => setActiveTab('admin')} className={`py-3.5 border-b ${activeTab === 'admin' ? 'border-zinc-300 text-zinc-100 font-medium' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>Admin Master Panel</button>
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
                    {books.map(b => {
                      const isIssuedByMe = activeStudent && b.isIssued && b.issuedTo?.includes(activeStudent.id);

                      return (
                        <tr key={b.id} className="hover:bg-zinc-900/40 transition">
                          <td className="py-3.5 px-5 font-mono text-zinc-400">{b.id}</td>
                          <td className="py-3.5 px-5 text-zinc-200 font-medium">{b.title}</td>
                          <td className="py-3.5 px-5 text-zinc-400">{b.author}</td>
                          <td className="py-3.5 px-5">
                            <span className={`inline-block text-[10px] px-2 py-0.5 rounded font-mono ${b.isIssued ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-800/50 text-zinc-300'}`}>
                              {b.isIssued ? 'Not Available' : 'Available'}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 text-right">
                            {!b.isIssued ? (
                              <button onClick={() => handleAction('issueBook', { id: b.id })} className="bg-zinc-800 text-zinc-300 px-3 py-1 rounded text-[11px] hover:bg-zinc-700 transition">Issue</button>
                            ) : isIssuedByMe ? (
                              <button onClick={() => handleAction('returnBook', { id: b.id })} className="border border-zinc-700 text-zinc-300 px-3 py-1 rounded text-[11px] hover:bg-zinc-800 transition">Return</button>
                            ) : (
                              <span className="text-[11px] text-zinc-500 font-mono italic">Not Available</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && currentRole === 'student' && (
            <div className="bg-[#121215] border border-zinc-800/80 p-6 rounded space-y-4">
              <div>
                <h2 className="text-sm font-medium text-zinc-100 tracking-wide">My Personal Dashboard</h2>
                <p className="text-[11px] text-zinc-500 mt-0.5">Books currently checked out under your student ID: {activeStudent?.id}</p>
              </div>

              {myIssuedBooks.length === 0 ? (
                <div className="py-12 text-center text-xs text-zinc-500 font-mono border border-dashed border-zinc-800 rounded">
                  No books currently issued to your account.
                </div>
              ) : (
                <div className="rounded overflow-hidden border border-zinc-800">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-500 font-mono uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-5">ID</th>
                        <th className="py-3 px-5">Book Title</th>
                        <th className="py-3 px-5">Date of Issuance</th>
                        <th className="py-3 px-5">Return Due Date</th>
                        <th className="py-3 px-5">Fine Status</th>
                        <th className="py-3 px-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {myIssuedBooks.map(b => (
                        <tr key={b.id} className="hover:bg-zinc-900/40 transition font-mono">
                          <td className="py-3.5 px-5 text-zinc-400">{b.id}</td>
                          <td className="py-3.5 px-5 text-zinc-200 font-medium font-sans">{b.title}</td>
                          <td className="py-3.5 px-5 text-zinc-300">{b.issuedDate || 'N/A'}</td>
                          <td className="py-3.5 px-5 text-zinc-300">{b.returnDate || 'N/A'} (1 Month)</td>
                          <td className="py-3.5 px-5">
                            <span className="bg-emerald-950/60 border border-emerald-900/60 text-emerald-400 text-[10px] px-2 py-0.5 rounded">
                              No Fine
                            </span>
                          </td>
                          <td className="py-3.5 px-5 text-right font-sans">
                            <button onClick={() => handleAction('returnBook', { id: b.id })} className="border border-zinc-700 text-zinc-300 px-3 py-1 rounded text-[11px] hover:bg-zinc-800 transition">Return</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="bg-[#121215] border border-zinc-800/80 p-6 rounded space-y-3">
              <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-4">Audit Log (Student Issues & Admin Actions)</h2>
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
            <div className="space-y-6">
              {/* Master Department Dashboard for Admin */}
              <div className="bg-[#121215] border border-zinc-800/80 p-6 rounded space-y-4">
                <div>
                  <h2 className="text-sm font-medium text-zinc-100 tracking-wide">Master Department Dashboard (All Active Issues)</h2>
                  <p className="text-[11px] text-zinc-500 mt-0.5">Complete overview of all books currently checked out across the Software Engineering department.</p>
                </div>

                {allIssuedBooks.length === 0 ? (
                  <div className="py-8 text-center text-xs text-zinc-500 font-mono border border-dashed border-zinc-800 rounded">
                    No books currently issued in the department.
                  </div>
                ) : (
                  <div className="rounded overflow-hidden border border-zinc-800">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-zinc-800 text-zinc-500 font-mono uppercase tracking-wider text-[10px]">
                          <th className="py-3 px-4">ID</th>
                          <th className="py-3 px-4">Book Title</th>
                          <th className="py-3 px-4">Issued To (Student)</th>
                          <th className="py-3 px-4">Issuance Date</th>
                          <th className="py-3 px-4">Due Date</th>
                          <th className="py-3 px-4">Fine Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50">
                        {allIssuedBooks.map(b => (
                          <tr key={b.id} className="hover:bg-zinc-900/40 transition font-mono">
                            <td className="py-3 px-4 text-zinc-400">{b.id}</td>
                            <td className="py-3 px-4 text-zinc-200 font-medium font-sans">{b.title}</td>
                            <td className="py-3 px-4 text-zinc-300">{b.issuedTo}</td>
                            <td className="py-3 px-4 text-zinc-400">{b.issuedDate || 'N/A'}</td>
                            <td className="py-3 px-4 text-zinc-300">{b.returnDate || 'N/A'}</td>
                            <td className="py-3 px-4">
                              <span className="bg-emerald-950/60 border border-emerald-900/60 text-emerald-400 text-[10px] px-2 py-0.5 rounded">
                                No Fine
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Insert Book Box */}
              <div className="bg-[#121215] border border-zinc-800/80 p-6 rounded space-y-4">
                <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500">Insert New Book Record</h2>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input type="number" placeholder="Book ID" value={id} onChange={e => setId(e.target.value)} className="bg-[#18181b] border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600 font-mono" />
                  <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="bg-[#18181b] border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600" />
                  <input type="text" placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} className="bg-[#18181b] border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-zinc-600" />
                  <button onClick={() => handleAction('addBook', { id, title, author })} className="bg-zinc-200 text-zinc-950 font-medium text-xs py-2 rounded hover:bg-white transition">Commit Record</button>
                </div>
              </div>

              {/* Admin Book Deletion Table */}
              <div className="bg-[#121215] border border-zinc-800/80 p-6 rounded space-y-4">
                <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500">Admin Management: Remove Books from Registry</h2>
                <div className="rounded overflow-hidden border border-zinc-800">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-500 font-mono uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-5">ID</th>
                        <th className="py-3 px-5">Title</th>
                        <th className="py-3 px-5">Author</th>
                        <th className="py-3 px-5 text-right">Admin Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {books.map(b => (
                        <tr key={b.id} className="hover:bg-zinc-900/40 transition">
                          <td className="py-3.5 px-5 font-mono text-zinc-400">{b.id}</td>
                          <td className="py-3.5 px-5 text-zinc-200 font-medium">{b.title}</td>
                          <td className="py-3.5 px-5 text-zinc-400">{b.author}</td>
                          <td className="py-3.5 px-5 text-right">
                            <button onClick={() => handleAction('deleteBook', { id: b.id })} className="bg-red-950/60 border border-red-900/60 text-red-300 px-3 py-1 rounded text-[11px] hover:bg-red-900 transition">Remove Book</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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