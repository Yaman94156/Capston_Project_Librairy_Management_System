import { Component, OnInit } from '@angular/core';
import { AdminDashboardService } from '../admin-dashboard';
import { Member } from '../admin-dashboard';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-members',
  imports: [CommonModule, FormsModule],
  templateUrl: './all-members.html',
  styleUrl: './all-members.css'
})
export class AllMembers implements OnInit {
members: Member[] = [];
  editingMember: Member | null = null;
  showAddForm = false;
  newMember: Member = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
  };

  constructor(private memberService: AdminDashboardService) {}

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers().subscribe({
      next: (data) => (this.members = data),
      error: () => alert('Failed to load members'),
    });
  }

  startEdit(member: Member) {
    this.editingMember = { ...member };
    this.showAddForm = false;
  }

  updateMember() {
    if (this.editingMember) {
      this.memberService.updateMember(this.editingMember.id, this.editingMember).subscribe({
        next: () => {
          this.editingMember = null;
          this.loadMembers();
        },
        error: () => alert('Failed to update member'),
      });
    }
  }

  addMember() {
      if (this.newMember.id <= 0) {
    alert('Member ID must be a positive number');
    return;
  }

  if (!this.newMember.name || !this.newMember.email) {
    alert('Name and Email are required');
    return;
  }
    this.memberService.addMember(this.newMember).subscribe({
      next: () => {
        alert('Member added successfully');
        this.newMember = { id: 0, name: '', email: '', phone: '', address: '', password: '' };
        this.showAddForm = false;
        this.loadMembers();
      },
      error: () => alert('Failed to add member'),
    });
  }

  deleteMember(id: number) {
    if (!confirm('Are you sure you want to delete this member?')) {
      return;
    }
    this.memberService.deleteMember(id).subscribe({
      next: () => {
        alert('Member deleted successfully');
        this.loadMembers();
      },
      error: () => alert('Failed to delete member'),
    });
  }

}
