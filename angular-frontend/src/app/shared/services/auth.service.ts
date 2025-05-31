import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8000/api';
  private tokenKey = 'authToken';

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Registra un nuevo usuario
   */
  register(user: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  /**
   * Inicia sesión y devuelve un token JWT
   */
  login(credentials: { email: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, credentials);
  }

  /**
   * Guarda el token en localStorage
   */
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Obtiene el token almacenado
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Devuelve la información del usuario autenticado
   */
  getUser(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/user-info`, { headers });
  }

  /**
   * Verifica si hay un token almacenado (autenticado)
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Cierra sesión y redirige a /login
   */
  logout(): void {
    this.clearToken();
    this.router.navigate(['/login'], { replaceUrl: true }); //evita que si se da para atrás en el navegador pueda volver a una ruta protegida. 
  }

  /**
   * Elimina el token del almacenamiento
   */
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
