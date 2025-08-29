import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminDashboardService } from '../admin-dashboard';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
activeForm: 'borrow' | 'return' | null = null;

  borrowData = { member_id: 0, isbn: '', return_date: '' };
  returnData = { member_id: 0, isbn: '' };

  borrowRecords: any[] = [];

  constructor(private adminService: AdminDashboardService, private router: Router) { }

  ngOnInit(): void {
    this.loadBorrowRecords();
  }

  toggleForm(formName: 'borrow' | 'return') {
    this.activeForm = this.activeForm === formName ? null : formName;
  }

  loadBorrowRecords() {
    this.adminService.getAllBorrows().subscribe({
      next: data => this.borrowRecords = data,
      error: () => alert('Failed to load borrow records')
    });
  }

  submitBorrow() {
    this.adminService.issueBook(this.borrowData).subscribe({
      next: () => {
        this.borrowData = { member_id: 0, isbn: '', return_date: '' };
        this.activeForm = null;
        this.loadBorrowRecords();
      },
      error: () => alert('Failed to issue book')
    });
  }

  submitReturn() {
    this.adminService.returnBook(this.returnData).subscribe({
      next: (res: any) => {
        alert(`Book returned successfully! Fine: ${res.fine} Rs`);
        this.returnData = { member_id: 0, isbn: '' };
        this.activeForm = null;
        this.loadBorrowRecords();
      },
      error: () => alert('Failed to return book')
    });
  }
  viewAllBooks() {
    this.router.navigate(['/books'])
  }

  viewAllMembers() {
    this.router.navigate(['/members'])
  }
  logout() {
    this.router.navigate(['/']); 
  }
}
