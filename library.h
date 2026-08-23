#ifndef LIBRARY_H
#define LIBRARY_H

#include "Book.h"
#include <vector>

class Library {
private:
    vector<Book> books;
    
    // DSA Concept: Sorting Algorithm
    void sortBooksById(); 

    // DSA Concept: Searching Algorithms
    void linearSearch(int id) const;
    void binarySearch(int id) const;

public:
    void addBook();
    void viewAllBooks() const;
    void searchBook(); // Naya search menu
};

#endif