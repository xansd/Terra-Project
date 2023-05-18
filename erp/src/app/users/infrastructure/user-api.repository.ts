import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import SERVER from '../../config/server.config';
import { IUserAPIPort } from '../domain/user-api.port';
import { Roles } from '../domain/roles';
import { IUser } from '../domain/user';
import { Email } from '../../shared/domain/value-objects/email.value-object';
import { UserDTOMapper } from './user-dto.mapper';
import { IUserDTO } from './user.dto';

const API_URI = SERVER.API_URI + '/users';

@Injectable({ providedIn: 'root' })
export class UsersAPIRepository implements IUserAPIPort {
  private readonly userDTOMapper: UserDTOMapper;

  constructor(private http: HttpClient) {
    this.userDTOMapper = new UserDTOMapper();
  }

  getUserByID(id: string): Observable<IUser> {
    throw new Error('Method not implemented.');
  }

  getAllUsers(): Observable<IUser[]> {
    return this.http
      .get<IUserDTO[]>(`${API_URI}`, { withCredentials: true })
      .pipe(
        map((userAPIList: IUserDTO[]) =>
          this.userDTOMapper.toDomainList(userAPIList)
        )
      );
  }

  createUser(email: Email, role_id: Roles): Observable<void> {
    return this.http.post<void>(
      `${API_URI}`,
      {
        email: email.value,
        role_id: role_id,
      },
      {
        withCredentials: true,
      }
    );
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${API_URI}/${id}`, {
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

  restorePassword(data: { id: string; password: string }): Observable<void> {
    throw new Error('Method not implemented.');
  }
}
