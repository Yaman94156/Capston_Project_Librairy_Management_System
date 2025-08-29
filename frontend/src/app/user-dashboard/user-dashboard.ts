import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserDashboardService, BorrowRecord } from '../user-dashboard';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-dashboard',
  imports: [CommonModule],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css'
})
export class UserDashboard implements OnInit{
  borrowRecords: BorrowRecord[] = [];
  memberId: number | null = null;
  currentFilter = 'all';
  Math = Math; // Make Math available in template

  constructor(private userDashboardService: UserDashboardService, private router: Router) {}

  ngOnInit(): void {
    const memberIdString = localStorage.getItem('memberId');
    this.memberId = memberIdString ? +memberIdString : null;

    if (this.memberId) {
      this.loadBorrows();
    } else {
      // Redirect to login page or show error
      alert('Not logged in. Please log in first.');
    }
  }

  loadBorrows() {
    if (this.memberId) {
      this.userDashboardService.getMemberBorrows(this.memberId).subscribe({
        next: (records) => (this.borrowRecords = records),
        error: () => alert('Failed to load borrow records'),
      });
    }
  }

  // Computed properties for statistics
  get activeBooksCount(): number {
    return this.borrowRecords.filter(record => !record.returned_on).length;
  }

  get overdueBooksCount(): number {
    return this.borrowRecords.filter(record => !record.returned_on && record.overdue).length;
  }

  get totalFine(): number {
    return this.borrowRecords.reduce((total, record) => total + (record.fine || 0), 0);
  }

  // Filter functionality
  setFilter(filter: 'all' | 'active' | 'overdue' | 'returned') {
    this.currentFilter = filter;
  }

  get filteredRecords(): BorrowRecord[] {
    switch (this.currentFilter) {
      case 'active':
        return this.borrowRecords.filter(record => !record.returned_on);
      case 'overdue':
        return this.borrowRecords.filter(record => !record.returned_on && record.overdue);
      case 'returned':
        return this.borrowRecords.filter(record => record.returned_on);
      default:
        return this.borrowRecords;
    }
  }

  logout() {
    localStorage.removeItem('memberId');
    this.router.navigate(['/']);  
  }
}
