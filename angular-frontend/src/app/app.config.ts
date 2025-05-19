import { routes } from './app.routes';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // ✅ usa withInterceptorsFromDi
import { HTTP_INTERCEPTORS } from '@angular/common/http'; // ✅ necesario para registrar interceptor
import { AuthInterceptor } from './interceptors/auth.interceptor'; // ✅ ruta al interceptor


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()), // ✅ activa interceptores
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
};
