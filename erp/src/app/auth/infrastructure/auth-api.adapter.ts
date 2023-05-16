import { Observable } from 'rxjs';
import { IAuthToken } from '../domain/token';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import SERVER from '../../config/server.config';
import { IAuthAPIPort } from '../domain/auth-api.port';
import { LoginCredentials } from '../application/use-cases/signin.use-case';
import { Roles } from 'src/app/users/domain/roles';

const API_URI = SERVER.API_URI + '/users';

@Injectable({ providedIn: 'root' })
export class AuthAPIAdapter implements IAuthAPIPort {
  constructor(private http: HttpClient) {}

  signin(credentials: LoginCredentials): Observable<IAuthToken> {
    return this.http.post<IAuthToken>(`${API_URI}/signin`, credentials);
  }

  checkPassword(credentials: LoginCredentials): Observable<IAuthToken> {
    return this.http.post<IAuthToken>(
      `${API_URI}/check-password`,
      credentials,
      {
        withCredentials: true,
      }
    );
  }

  changePassword(data: {
    id: string;
    password: string;
    isAdminAction?: boolean;
  }): Observable<void> {
    return this.http.put<void>(`${API_URI}/update-password`, data, {
      withCredentials: true,
    });
  }

  activateUser(id: string): Observable<void> {
    return this.http.put<void>(`${API_URI}/activate/${id}`, {
      withCredentials: true,
    });
  }

  blockUser(id: string): Observable<void> {
    return this.http.put<void>(`${API_URI}/block/${id}`, {
      withCredentials: true,
    });
  }

  updateRoleUser(id: string, role: Roles): Observable<void> {
    return this.http.put<void>(
      `${API_URI}/role/${id}`,
      { role_id: role },
      {
        withCredentials: true,
      }
    );
  }
}
