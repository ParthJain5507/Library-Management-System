#include "Library.h"

void Library::addBook() {
    int id;
    string title, author;

    cout << "\nEnter Book ID: ";
    cin >> id;
    cin.ignore(); // Clear the input buffer before reading strings

    cout << "Enter Book Title: ";
    getline(cin, title);

    cout << "Enter Book Author: ";
    getline(cin, author);

    // Create a new book object
    Book newBook(id, title, author);
    
    // Add it to our vector
    books.push_back(newBook);
    
    cout << "\nBook added successfully!\n";
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