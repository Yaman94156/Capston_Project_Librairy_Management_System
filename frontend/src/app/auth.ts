import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface AdminLoginResponse {
  message: string;
  admin: {
    id: number;
    username: string;
  };
}

interface MemberLoginResponse {
  message: string;
  member: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private baseUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) {}

  adminLogin(username: string, password: string): Observable<AdminLoginResponse> {
    return this.http.post<AdminLoginResponse>(`${this.baseUrl}/admin/login`, { username, password });
  }

  memberLogin(email: string, password: string): Observable<MemberLoginResponse> {
    return this.http.post<MemberLoginResponse>(`${this.baseUrl}/login`, { email, password });
  }
}
