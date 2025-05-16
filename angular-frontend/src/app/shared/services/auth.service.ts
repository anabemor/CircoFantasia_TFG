import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/login'; // Endpoint de login
  private registerUrl = 'http://localhost:8000/api/register'; // Endpoint de registro
  private tokenKey = 'authToken'; // Clave del token en localStorage

  constructor(private http: HttpClient) {}

  /**
   * Inicia sesión con email y password. Devuelve un observable con el token.
   */
  login(credentials: { email: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.apiUrl, credentials);
  }

  /**
   * Registra un nuevo usuario. Devuelve un observable con la respuesta.
   */
  register(user: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post<any>(this.registerUrl, user);
  }

  /**
   * Guarda el token en localStorage.
   */
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Obtiene el token almacenado.
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Elimina el token del almacenamiento.
   */
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  /**
   * Verifica si el usuario está autenticado.
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
