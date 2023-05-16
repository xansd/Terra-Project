import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { Observable } from 'rxjs';
import { IUser } from '../domain/user';
import { IUserIOPort } from '../domain/user-io.port';
import { environment } from 'src/environments/environment';

@Injectable()
export class UserIOAdapter implements IUserIOPort {
  private socket!: Socket;

  constructor() {}

  createServer() {
    this.socket = io(environment.IO_URI);
  }

  closeServer() {
    this.socket.close();
  }

  registerActiveUser(id: string): void {
    this.socket.emit('registerActiveUser', id);
  }

  unRegisterActiveUser(id: string): void {
    this.socket.emit('unRegisterActiveUser', id);
  }

  getActiveUsers(): Observable<IUser[]> {
    return new Observable<IUser[]>((observer) => {
      this.socket.emit('getActiveUsers');

      this.socket.on('activeUsersList', (activeUsers: IUser[]) => {
        observer.next(activeUsers);
      });

      return () => {
        this.socket.off('activeUsersList');
      };
    });
  }

  logOutRemoteUser(id: string): void {
    this.socket.emit('logoutActiveUser', id);
  }

  removeToken(): Observable<string> {
    return new Observable<string>((observer) => {
      this.socket.on('removeToken', (userId: string) => {
        observer.next(userId);
      });

      return () => {
        this.socket.off('removeToken');
      };
    });
  }
}
