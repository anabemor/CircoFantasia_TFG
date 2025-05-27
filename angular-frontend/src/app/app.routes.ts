import { ActividadesComponent } from './modules/admin/actividades/actividades.component';
import { Routes } from '@angular/router';
import { LandingComponent } from './modules/landing/landing.component';
import { LoginComponent } from './modules/login/login.component';
import { RegisterComponent } from './modules/register/register.component';
import { AdminDashboardComponent } from './modules/admin/admin-dashboard/admin-dashboard.component';
import { UsuariosComponent } from './modules/admin/usuarios/usuarios.component';
import { ReservasComponent } from './modules/admin/reservas/reservas.component';
import { CompraComponent } from './modules/cliente/compra/compra/compra.component';
import { SeleccionTicketsComponent } from './modules/cliente/compra/seleccion-tickets/seleccion-tickets.component';
import { SeleccionFechaComponent } from './modules/cliente/compra/seleccion-fecha/seleccion-fecha.component';
import { DatosVisitanteComponent } from './modules/cliente/compra/datos-visitante/datos-visitante.component';
import { ResumenPagoComponent } from './modules/cliente/compra/resumen-pago/resumen-pago.component';
import { ConfirmacionComponent } from './modules/cliente/compra/confirmacion/confirmacion.component';

export const routes: Routes = [
    {path: "", component: LandingComponent},
    {path: "login", component: LoginComponent},
    {
    path: 'recuperar-password',
    loadComponent: () => import('./modules/login/recuperar-password.component').then(m => m.RecuperarPasswordComponent)
    },
    {path: 'register', component: RegisterComponent},
    {path: 'admin', component: AdminDashboardComponent}, 
    {path: 'admin/usuarios', component: UsuariosComponent},
    {path: 'admin/actividades', component: ActividadesComponent},
    {path: 'admin/reservas', component: ReservasComponent},
    {path: 'compra',
        component: CompraComponent,
        children: [
            { path: '', redirectTo: 'tickets', pathMatch: 'full' },
            { path: 'tickets', component: SeleccionTicketsComponent },
            { path: 'fecha', component: SeleccionFechaComponent },
            { path: 'datos', component: DatosVisitanteComponent },
            { path: 'pago', component: ResumenPagoComponent },
            { path: 'confirmacion', component: ConfirmacionComponent }
        ]
    },
        
    {path: '**', redirectTo: '' }
];
