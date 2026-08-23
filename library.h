#ifndef LIBRARY_H
#define LIBRARY_H

#include "Book.h"
#include <vector>

class Library {
private:
    // DSA Concept #1: Vector
    vector<Book> books;

public:
    void addBook();
    void viewAllBooks() const;
};

#endif