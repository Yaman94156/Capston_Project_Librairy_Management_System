import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface BorrowRecord {
  member_id: number;
  isbn: string;
  borrow_date: string;
  return_date: string;
  returned_on?: string | null;
  fine?: number;
  overdue?: boolean;
}

export interface Book {
  id?: number;
  isbn: string;
  name: string;
  author: string;
  quantity: number;
  description: string;
}

export interface Member {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  private baseUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) {}

  getAllBorrows(): Observable<BorrowRecord[]> {
    return this.http.get<BorrowRecord[]>(`${this.baseUrl}/borrows`);
  }

  issueBook(data: { member_id: number; isbn: string; return_date: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/borrow`, data);
  }

  returnBook(data: { member_id: number; isbn: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/return`, data);
  }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}/books`);
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.baseUrl}/books/${id}`);
  }

  updateBook(id: number, bookData: Partial<Book>): Observable<any> {
    return this.http.put(`${this.baseUrl}/books/${id}`, bookData);
  }

  addBook(bookData: Book): Observable<any> {
    return this.http.post(`${this.baseUrl}/books`, bookData);
  }

  getMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.baseUrl}/members`);
  }

  getMemberById(id: number): Observable<Member> {
    return this.http.get<Member>(`${this.baseUrl}/members/${id}`);
  }

  updateMember(id: number, memberData: Partial<Member>): Observable<any> {
    return this.http.put(`${this.baseUrl}/members/${id}`, memberData);
  }

  addMember(memberData: Member): Observable<any> {
    return this.http.post(`${this.baseUrl}/members`, memberData);
  }

  deleteBook(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/books/${id}`);
  }

  deleteMember(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/members/${id}`);
  }


searchBookByIdOrIsbn(id?: number, isbn?: string): Observable<Book> {
  const params: any = {};
  if (id !== undefined && id !== null && !Number.isNaN(id))  params.id = id;
  if (isbn) params.isbn = isbn;
  return this.http.get<Book>(`${this.baseUrl}/books/search`, { params });
}


searchBooksFlexible(name?: string, author?: string): Observable<Book[]> {
  const params: any = {};
  if (name) params.name = name;
  if (author) params.author = author;
  return this.http.get<Book[]>(`${this.baseUrl}/books/search`, { params });
}

}
