import { Routes } from '@angular/router';
import { TasksComponent } from './modules/tasks/tasks.component';
import { LandingComponent } from './modules/landing/landing.component';
import { LoginComponent } from './modules/login/login.component';

export const routes: Routes = [
    {path: "", component: LandingComponent},
    {path: "tasks", component: TasksComponent},
    {path: "login", component: LoginComponent}
];
