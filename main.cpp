#include <iostream>
#include "Library.h"

using namespace std;

int main() {
    Library lib;
    int choice;

    do {
        cout << "\n====================================";
        cout << "\n     LIBRARY MANAGEMENT SYSTEM      ";
        cout << "\n====================================\n";
        cout << "1. Add Book\n";
        cout << "2. View Books\n";
        cout << "3. Search Book (Linear/Binary)\n";
        cout << "0. Exit\n";
        cout << "Enter your choice: ";
        cin >> choice;

        switch (choice) {
            case 1:
                lib.addBook();
                break;
            case 2:
                lib.viewAllBooks();
                break;
            case 3:
                lib.searchBook();
                break;
            case 0:
                cout << "Exiting the system...\n";
                break;
            default:
                cout << "Invalid choice! Please try again.\n";
        }
    } while (choice != 0);

    return 0;
}