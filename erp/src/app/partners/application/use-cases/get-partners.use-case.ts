// import { Observable } from 'rxjs';
// import { IUser } from '../../domain/user';
// import { IUserAPIPort } from '../../domain/user-api.port';
// import { Inject, Injectable } from '@angular/core';

// export interface IGetAllUsersUserCase {
//   getAllUsers(): Observable<IUser[]>;
// }
// @Injectable({
//   providedIn: 'root',
// })
// export class GetAllUsersUserCase implements IGetAllUsersUserCase {
//   constructor(@Inject('usersAPI') private readonly usersAPI: IUserAPIPort) {}
//   getAllUsers(): Observable<IUser[]> {
//     return this.usersAPI.getAllUsers();
//   }
// }
