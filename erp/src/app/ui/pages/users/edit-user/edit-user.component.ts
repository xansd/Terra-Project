import { Component, Input, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivateUserUseCase } from 'src/app/auth/application/use-cases/activate-user.use-case';
import { BlockUserUseCase } from 'src/app/auth/application/use-cases/block-user.use-case';
import { UpdatePasswordUseCase } from 'src/app/auth/application/use-cases/update-password.use-case';
import { updateRoleUserUseCase } from 'src/app/auth/application/use-cases/update-rol.case-use';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { AppStateService } from 'src/app/ui/services/app-state.service';
import { Roles } from 'src/app/users/domain/roles';
import { IUser, User } from 'src/app/users/domain/user';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  @Input() user!: IUser;
  editUser: UntypedFormGroup = this.formBuilder.group({
    rol: [null, Validators.required],
  });
  roles = Object.values(Roles).filter((value) => typeof value === 'string');
  isActive = true;
  originalUser!: IUser;

  constructor(
    public modal: NgbActiveModal,
    private formBuilder: UntypedFormBuilder,
    private service: AppStateService,
    private notifier: NotificationAdapter,
    private activateUserService: ActivateUserUseCase,
    private restorePasswordUseCase: UpdatePasswordUseCase,
    private blockUserService: BlockUserUseCase,
    private updateRoleService: updateRoleUserUseCase
  ) {}

  ngOnInit(): void {
    this.cloneUser();
    this.populateData();
  }

  cloneUser(): void {
    this.originalUser = this.service.cloneObject(this.user);
  }

  populateData(): void {
    this.isActive = this.user.active ? true : false;
    this.editUser.get('rol')!.setValue(this.roles[this.user.role_id - 1]);
  }

  toggleState(): void {
    this.isActive = !this.isActive;
    if (this.isActive) this.activateUser();
    else this.blockUser();
  }

  onRoleChange(selectElement: HTMLSelectElement) {
    const selectedValue = selectElement.value;
    this.updateRole(User.getRoleNumberFromName(selectedValue));
  }

  restorePassword(): void {
    const id = this.user.user_id!;
    this.restorePasswordUseCase.updatePassword(id, 'reset', true).subscribe({
      next: (res: any) => {
        if (res.affectedRows > 0) {
          this.notifier.showNotification('success', 'Password restablecido');
          this.user.active = true;
        }
      },
      error: (error: Error) => {
        console.log(error);
      },
    });
  }

  activateUser(): any {
    const id = this.user.user_id!;
    this.activateUserService.activateUser(id).subscribe({
      next: (res: any) => {
        if (res.affectedRows > 0) {
          this.notifier.showNotification('success', 'Usuario activado');
          this.user.active = true;
        }
      },
      error: (error: Error) => {
        console.log(error);
      },
    });
  }

  blockUser(): any {
    const id = this.user.user_id!;
    this.blockUserService.blockUser(id).subscribe({
      next: (res: any) => {
        if (res.affectedRows > 0) {
          this.notifier.showNotification('success', 'Usuario bloqueado');
          this.user.active = false;
        }
      },
    });
  }

  updateRole(role: number): any {
    this.updateRoleService.updateRoleUser(this.user.user_id!, role).subscribe({
      next: (res: any) => {
        if (res.affectedRows > 0) {
          this.notifier.showNotification('success', 'Rol actualizado');
          this.user.role_id = role;
        }
      },
      error: (error: Error) => {
        console.log(error);
      },
    });
  }

  rollBack(): void {
    this.user = { ...this.originalUser };
  }

  close(): void {
    if (JSON.stringify(this.user) === JSON.stringify(this.originalUser)) {
      // El usuario no modifico nada
      this.modal.close(false);
    }
    this.modal.close(this.user);
  }
}
