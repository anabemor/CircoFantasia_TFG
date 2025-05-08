import { Routes } from '@angular/router';
//import { TasksComponent } from './modules/tasks/tasks.component';
import { LandingComponent } from './modules/landing/landing.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { AdminDashboardComponent } from './modules/admin/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
    {path: "", component: LandingComponent},
    //{path: "tasks", component: TasksComponent},
    {path: "login", component: LoginComponent},
    {path: 'admin', component: AdminDashboardComponent}
];
