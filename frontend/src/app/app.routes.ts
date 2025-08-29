import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Adminlogin } from './adminlogin/adminlogin';
import { Userlogin } from './userlogin/userlogin';
import { UserDashboard } from './user-dashboard/user-dashboard'
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { AllBooks } from './all-books/all-books';
import { AllMembers } from './all-members/all-members';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'adminLogin', component: Adminlogin },
    { path: 'userLogin', component: Userlogin},
    { path: 'userDashboard', component: UserDashboard },
    { path: 'adminDashboard', component: AdminDashboard },
    { path: 'books', component: AllBooks},
    { path: 'members', component: AllMembers},
    {path:'home',component: Home}
];
