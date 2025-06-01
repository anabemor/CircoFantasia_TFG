import { Routes } from '@angular/router';
import { LayoutClienteComponent } from './modules/cliente/layout-cliente/layout-cliente.component';
import { CompraComponent } from './modules/cliente/compra/compra/compra.component';
import { SeleccionTicketsComponent } from './modules/cliente/compra/seleccion-tickets/seleccion-tickets.component';
import { SeleccionFechaComponent } from './modules/cliente/compra/seleccion-fecha/seleccion-fecha.component';
import { DatosVisitanteComponent } from './modules/cliente/compra/datos-visitante/datos-visitante.component';
import { ResumenPagoComponent } from './modules/cliente/compra/resumen-pago/resumen-pago.component';
import { ConfirmacionComponent } from './modules/cliente/compra/confirmacion/confirmacion.component';
import { ContactoFormComponent } from './modules/cliente/contacto/contacto-form.component';

import { LoginComponent } from './modules/login/login.component';
import { RegisterComponent } from './modules/register/register.component';
import { AdminDashboardComponent } from './modules/admin/admin-dashboard/admin-dashboard.component';
import { ActividadesComponent } from './modules/admin/actividades/actividades.component';
import { UsuariosComponent } from './modules/admin/usuarios/usuarios.component';
import { ReservasComponent } from './modules/admin/reservas/reservas.component';
import { AdminAuthGuard } from './shared/guards/admin-auth.guard';
import { BuzonComponent } from './modules/admin/buzon/buzon.component';

export const routes: Routes = [
  // 🌐 Parte pública (CLIENTE)
  {
    path: '',
    component: LayoutClienteComponent,
    children: [
      { path: '', redirectTo: 'compra/tickets', pathMatch: 'full' },

      {
        path: 'compra',
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

      { path: 'contacto', component: ContactoFormComponent }
    ]
  },

  // 🔐 Parte privada (ADMIN)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'admin', component: AdminDashboardComponent, canActivate: [AdminAuthGuard] },
  { path: 'admin/usuarios', component: UsuariosComponent, canActivate: [AdminAuthGuard] },
  { path: 'admin/buzon', component: BuzonComponent, canActivate: [AdminAuthGuard]},
  { path: 'admin/reservas', component: ReservasComponent, canActivate: [AdminAuthGuard] },
  { path: 'admin/reservas/historial', 
    loadComponent: () => import('./modules/admin/reservas/historial-reservas/historial-reservas.component').then(m => m.HistorialReservasComponent),
     canActivate: [AdminAuthGuard]},

  // Redirección por defecto
  { path: '**', redirectTo: '' }
];
