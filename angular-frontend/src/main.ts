import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { provideNativeDateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

registerLocaleData(localeEs);

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideNativeDateAdapter(), // ✅ Proveedor necesario para MatDatepicker
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' } // ✅ Localización
  ]
}).catch((err) => console.error(err));
