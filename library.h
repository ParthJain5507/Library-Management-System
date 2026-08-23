#ifndef LIBRARY_H
#define LIBRARY_H

#include "Book.h"
#include <vector>
#include <string>

// DSA Concept: Linked List Node for History Tracking
struct HistoryNode {
    string logMessage;
    HistoryNode* next;
    
    // Node Constructor
    HistoryNode(string msg) {
        logMessage = msg;
        next = nullptr;
    }
};

class Library {
private:
    vector<Book> books;
    HistoryNode* historyHead; // Linked List ka Head pointer

    // Helpers
    void sortBooksById(); 
    void linearSearch(int id) const;
    void binarySearch(int id) const;
    void addHistory(string message); // History list mein node add karne ke liye

public:
    Library();  // Constructor
    ~Library(); // Destructor (Memory free karne ke liye)

    void addBook();
    void viewAllBooks() const;
    void searchBook(); 

    // Naye Features
    void issueBook();
    void returnBook();
    void viewHistory() const;
};

#endif