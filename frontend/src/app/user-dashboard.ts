import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BorrowRecord {
  isbn: string;
  book_name: string;
  description: string;
  borrow_date: string;
  return_date: string;
  days_left: number;
  overdue: boolean;
  fine: number;
  returned_on?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class UserDashboardService {
  private baseUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) {}

  getMemberBorrows(memberId: number): Observable<BorrowRecord[]> {
    return this.http.get<BorrowRecord[]>(`${this.baseUrl}/borrows/${memberId}`);
  }
}
