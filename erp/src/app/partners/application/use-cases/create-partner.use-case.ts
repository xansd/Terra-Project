// import { Observable } from 'rxjs';
// import { IUserAPIPort } from '../../../users/domain/user-api.port';
// import { Email } from '../../../shared/domain/value-objects/email.value-object';
// import { Inject, Injectable } from '@angular/core';
// import { Roles } from '../../../users/domain/roles';

// export interface ICreateUserUseCase {
//   createUser(email: Email, role_id: Roles): Observable<void>;
// }
// @Injectable({
//   providedIn: 'root',
// })
// export class CreateUserUseCase implements ICreateUserUseCase {
//   constructor(@Inject('usersAPI') private readonly usersAPI: IUserAPIPort) {}
//   createUser(email: Email, role_id: Roles): Observable<void> {
//     return this.usersAPI.createUser(email, role_id);
//   }
// }
