import { Component, OnInit } from '@angular/core';
import { Book, AdminDashboardService } from '../admin-dashboard';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-books',
  imports: [CommonModule, FormsModule],
  templateUrl: './all-books.html',
  styleUrl: './all-books.css'
})
export class AllBooks implements OnInit{
  books: Book[] = [];
  searchId: number | null = null;
  searchIsbn: string = '';
  foundBook: Book | null = null;
  editingBook: Book | null = null;
  showAddForm = false;
  newBook = { isbn: '', name: '', author: '', quantity: 0, description: '' };


  constructor(private bookService: AdminDashboardService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getBooks().subscribe({
      next: (data) => (this.books = data),
      error: () => alert('Failed to load books'),
    });
  }

  startEdit(book: Book) {
    this.editingBook = { ...book };
    this.showAddForm = false;
  }

  updateBook() {
    if (this.editingBook && this.editingBook.id !== undefined) {
      this.bookService.updateBook(this.editingBook.id, this.editingBook).subscribe({
        next: () => {
          this.editingBook = null;
          this.loadBooks();
        },
      });
    } else {
      alert('Book ID is missing!');
    }
  }

  addBook() {
    this.bookService.addBook(this.newBook).subscribe({
      next: () => {
        this.newBook = { isbn: '', name: '', author: '', quantity: 0, description: '' };
        this.showAddForm = false;
        this.loadBooks();
      },
      error: (err) => {
        alert('Failed to add book: ' + (err.error?.error || 'Unknown error'));
      }
    });
  }

  deleteBook(id?: number) {
    if (!id) {
      alert('Invalid book ID');
      return;
    }
    if (!confirm('Are you sure you want to delete this book?')) {
      return;
    }
    this.bookService.deleteBook(id).subscribe({
      next: () => {
        this.loadBooks();
      },
      error: () => alert('Failed to delete book'),
    });
  }


searchBooks() {
  this.foundBook = null;
  if ((!this.searchId || this.searchId === null) && (!this.searchIsbn || this.searchIsbn.trim() === '')) {
    alert('Please enter Book ID or ISBN');
    return;
  }
  this.bookService.searchBookByIdOrIsbn(this.searchId ?? undefined, this.searchIsbn || undefined).subscribe({
    next: (book) => {
      this.foundBook = book;
    },
    error: () => {
      this.foundBook = null;
      alert('Book not found');
    }
  });
}

clearSearch() {
  this.searchId = null;
  this.searchIsbn = '';
  this.foundBook = null;
}

}
