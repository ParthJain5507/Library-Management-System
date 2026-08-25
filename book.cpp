#include "Book.h"

Book::Book(int id, string title, string author) {
    this->id = id;
    this->title = title;
    this->author = author;
    this->isIssued = false; // By default, a new book is not issued
}

int Book::getId() const { return id; }
string Book::getTitle() const { return title; }
string Book::getAuthor() const { return author; }
bool Book::getIsIssued() const { return isIssued; }

void Book::setIsIssued(bool status) {
    isIssued = status;
}

void Book::displayBook() const {
    cout << "ID: " << id 
         << " | Title: " << title 
         << " | Author: " << author 
         << " | Status: " << (isIssued ? "Issued" : "Available") << endl;
}