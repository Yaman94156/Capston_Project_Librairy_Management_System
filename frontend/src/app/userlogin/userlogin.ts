import { Component } from '@angular/core';
import { Auth } from '../auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userlogin',
  imports: [FormsModule, CommonModule],
  templateUrl: './userlogin.html',
  styleUrl: './userlogin.css'
})
export class Userlogin {
  email = '';
  password = '';
  error = '';
  isLoading = false;

  constructor(private memberAuthService: Auth, private router: Router ) { }

  onSubmit() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.error = '';
    
    this.memberAuthService.memberLogin(this.email, this.password).subscribe({
      next: (res) => {
        this.isLoading = false;
        // Store member ID in local storage
        localStorage.setItem('memberId', res.member.id.toString());
        this.router.navigate(['/userDashboard'])

        // Optionally store other info or tokens as needed
        // Redirect to member dashboard or other page
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.error || 'Login failed. Please check your credentials.';
      }
    });
  }
}
