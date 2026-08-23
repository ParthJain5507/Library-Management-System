#include "Library.h"
#include <iostream>

// Constructor: Head ko shuru mein null rakho
Library::Library() {
    historyHead = nullptr;
}

// Destructor: Program band hone par Linked List ki memory free karna (Good Practice!)
Library::~Library() {
    HistoryNode* current = historyHead;
    while (current != nullptr) {
        HistoryNode* nextNode = current->next;
        delete current;
        current = nextNode;
    }
}

// ==========================================
// LINKED LIST IMPLEMENTATION (History Logs)
// ==========================================

// History linked list ke end mein naya node jodna
void Library::addHistory(string message) {
    HistoryNode* newNode = new HistoryNode(message);
    
    // Agar list khali hai
    if (historyHead == nullptr) {
        historyHead = newNode;
        return;
    }

    // Traverse karke last node tak jao
    HistoryNode* temp = historyHead;
    while (temp->next != nullptr) {
        temp = temp->next;
    }
    temp->next = newNode; // Last node mein naya node connect kar do
}

void Library::viewHistory() const {
    if (historyHead == nullptr) {
        cout << "\nNo history available yet.\n";
        return;
    }

    cout << "\n--- LIBRARY TRANSACTION HISTORY ---\n";
    HistoryNode* temp = historyHead;
    int count = 1;
    while (temp != nullptr) {
        cout << count << ". " << temp->logMessage << endl;
        temp = temp->next;
        count++;
    }
    cout << "-----------------------------------\n";
}

// ==========================================
// ISSUE & RETURN LOGIC
// ==========================================

void Library::issueBook() {
    int id;
    cout << "\nEnter Book ID to issue: ";
    cin >> id;

    for (int i = 0; i < books.size(); i++) {
        if (books[i].getId() == id) {
            if (books[i].getIsIssued()) {
                cout << "Sorry, this book is already issued to someone else!\n";
            } else {
                books[i].setIsIssued(true); // Book status update kiya
                cout << "Book '" << books[i].getTitle() << "' issued successfully!\n";
                
                // Linked List mein Log add kiya
                addHistory("Issued Book: ID " + to_string(id) + " - " + books[i].getTitle());
            }
            return;
        }
    }
    cout << "Book with ID " << id << " not found!\n";
}

void Library::returnBook() {
    int id;
    cout << "\nEnter Book ID to return: ";
    cin >> id;

    for (int i = 0; i < books.size(); i++) {
        if (books[i].getId() == id) {
            if (!books[i].getIsIssued()) {
                cout << "This book is not issued yet!\n";
            } else {
                books[i].setIsIssued(false); // Book status wapas available kar diya
                cout << "Book '" << books[i].getTitle() << "' returned successfully!\n";
                
                // Linked List mein Log add kiya
                addHistory("Returned Book: ID " + to_string(id) + " - " + books[i].getTitle());
            }
            return;
        }
    }
    cout << "Book with ID " << id << " not found!\n";
}

// ==========================================
// PREVIOUS LOGIC (Add, View, Search, Sort)
// ==========================================

void Library::addBook() {
    int id;
    string title, author;
    cout << "\nEnter Book ID: ";
    cin >> id;
    cin.ignore();
    cout << "Enter Book Title: ";
    getline(cin, title);
    cout << "Enter Book Author: ";
    getline(cin, author);

    Book newBook(id, title, author);
    books.push_back(newBook);
    cout << "\nBook added successfully!\n";
    addHistory("Added New Book: ID " + to_string(id) + " - " + title);
}

void Library::viewAllBooks() const {
    if (books.empty()) {
        cout << "\nNo books available in the library.\n";
        return;
    }
    cout << "\n--- LIST OF BOOKS ---\n";
    for (const Book& book : books) {
        book.displayBook();
    }
    cout << "---------------------\n";
}

// ==========================================
// DSA ALGORITHMS IMPLEMENTATION
// ==========================================

// Bubble Sort: ID ke hisaab se ascending order mein sort karna
void Library::sortBooksById() {
    int n = books.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (books[j].getId() > books[j + 1].getId()) {
                // Swap manually
                Book temp = books[j];
                books[j] = books[j + 1];
                books[j + 1] = temp;
            }
        }
    }
    cout << "(Books sorted by ID automatically for Binary Search)\n";
}

// Linear Search (Time Complexity: O(n))
void Library::linearSearch(int id) const {
    for (int i = 0; i < books.size(); i++) {
        if (books[i].getId() == id) {
            cout << "\nBook Found (using Linear Search)!\n";
            books[i].displayBook();
            return;
        }
    }
    cout << "\nBook with ID " << id << " not found!\n";
}

// Binary Search (Time Complexity: O(log n))
void Library::binarySearch(int id) const {
    int left = 0;
    int right = books.size() - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;

        if (books[mid].getId() == id) {
            cout << "\nBook Found (using Binary Search)!\n";
            books[mid].displayBook();
            return;
        }
        
        if (books[mid].getId() < id) {
            left = mid + 1; // Search right half
        } else {
            right = mid - 1; // Search left half
        }
    }
    cout << "\nBook with ID " << id << " not found!\n";
}

// Search Menu Logic
void Library::searchBook() {
    if (books.empty()) {
        cout << "\nLibrary is empty! Add books first.\n";
        return;
    }

    int searchId;
    cout << "\nEnter Book ID to search: ";
    cin >> searchId;

    int choice;
    cout << "Choose Search Algorithm:\n";
    cout << "1. Linear Search (Works on Unsorted Data)\n";
    cout << "2. Binary Search (Requires Sorted Data)\n";
    cout << "Enter choice: ";
    cin >> choice;

    if (choice == 1) {
        linearSearch(searchId);
    } else if (choice == 2) {
        sortBooksById(); // Binary Search fails if data is not sorted
        binarySearch(searchId);
    } else {
        cout << "Invalid choice!\n";
    }
}