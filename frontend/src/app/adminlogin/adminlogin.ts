import { Component } from '@angular/core';
import { Auth } from '../auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adminlogin',
  imports: [CommonModule, FormsModule],
  templateUrl: './adminlogin.html',
  styleUrl: './adminlogin.css'
})
export class Adminlogin {
  username = '';
  password = '';
  error = '';
  isLoading = false;

  constructor(private adminAuthService: Auth, private router: Router) {}

  onSubmit() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.error = '';
    
    this.adminAuthService.adminLogin(this.username, this.password).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.router.navigate(['/adminDashboard'])
        // TODO: navigate to admin dashboard or store auth token/session
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error.error || 'Login failed.';
      }
    });
  }
}
