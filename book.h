#ifndef BOOK_H
#define BOOK_H

#include <string>
#include <iostream>

using namespace std;

class Book {
private:
    int id;
    string title;
    string author;
    bool isIssued;

public:
    // Constructor
    Book(int id, string title, string author);

    // Getters
    int getId() const;
    string getTitle() const;
    string getAuthor() const;
    bool getIsIssued() const;

    // Setters
    void setIsIssued(bool status);

    // Display function
    void displayBook() const;
};

#endif