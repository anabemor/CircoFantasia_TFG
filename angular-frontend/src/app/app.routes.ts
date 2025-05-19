import { ActividadesComponent } from './modules/admin/actividades/actividades.component';
import { Routes } from '@angular/router';
import { LandingComponent } from './modules/landing/landing.component';
import { LoginComponent } from './modules/login/login/login.component';
import { RegisterComponent } from './modules/register/register.component';
import { AdminDashboardComponent } from './modules/admin/admin-dashboard/admin-dashboard.component';
import { UsuariosComponent } from './modules/admin/usuarios/usuarios.component';
import { ReservasComponent } from './modules/admin/reservas/reservas.component';

export const routes: Routes = [
    {path: "", component: LandingComponent},
    {path: "login", component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'admin', component: AdminDashboardComponent}, 
    {path: 'admin/usuarios', component: UsuariosComponent},
    {path: 'admin/actividades', component: ActividadesComponent},
    {path: 'admin/reservas', component: ReservasComponent},
    {path: '**', redirectTo: '' }
];
