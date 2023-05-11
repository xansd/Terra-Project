import { Component, Input, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorHandlerService } from 'src/app/shared/error/error-handler';
import { NotificationAdapter } from 'src/app/shared/infraestructure/notifier.adapter';
import { AppStateService } from 'src/app/ui/services/app-state.service';
import { ActivateUserUseCase } from 'src/app/users/application/use-cases/activate-user.use-case';
import { BlockUserUseCase } from 'src/app/users/application/use-cases/block-user.use-case';
import { updateRoleUserUseCase } from 'src/app/users/application/use-cases/update-rol.case-use';
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
    private blockUserService: BlockUserUseCase,
    private updateRoleService: updateRoleUserUseCase,
    private errorHandler: ErrorHandlerService
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
    this.editUser.get('rol')!.setValue(this.roles[this.user.role_id]);
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

  activateUser(): any {
    const id = this.user.user_id!;
    this.activateUserService.activateUser(id).subscribe({
      next: (res: any) => {
        if (res.statusCode) {
          this.errorHandler.handleKnowError(res);
        } else {
          this.notifier.showNotification('success', 'Usuario activado');
          this.user.active = true;
        }
      },
    });
  }

  blockUser(): any {
    const id = this.user.user_id!;
    this.blockUserService.blockUser(id).subscribe({
      next: (res: any) => {
        if (res.statusCode) {
          this.errorHandler.handleKnowError(res);
        } else {
          this.notifier.showNotification('warning', 'Usuario bloqueado');
          this.user.active = false;
        }
      },
    });
  }

  updateRole(role: number): any {
    this.updateRoleService.updateRoleUser(this.user.user_id!, role).subscribe({
      next: (res: any) => {
        if (res.statusCode) {
          this.errorHandler.handleKnowError(res);
        } else {
          this.notifier.showNotification('success', 'Rol actualizado');
          this.user.role_id = role;
        }
      },
    });
  }

  rollBack(): void {
    this.user = { ...this.originalUser };
  }

  close(): void {
    this.modal.close(this.user);
  }
}
