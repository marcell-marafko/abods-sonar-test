import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Subscription } from 'rxjs';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormErrors } from 'src/app/shared/gds/error-summary/error-summary.component';
import { RoleFragment, UserFragment } from 'src/generated/graphql';
import { OrganisationService } from '../organisation.service';
import { AuthenticatedUserService } from 'src/app/authentication/authenticated-user.service';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  inviteForm: FormGroup;
  errors: FormErrors[] = [];
  submitted = false;

  inviteSent = false;

  subs: Subscription[] = [];

  loaded = false;
  errored = false;

  authenticatedUser: UserFragment | null = null;
  get authenticatedUserIsAdmin(): boolean {
    return this.authenticatedUser?.roles.some(({ name }) => name === 'Administrator') ?? false;
  }
  get authenticatedUserIsOrgUser(): boolean {
    return this.authenticatedUser?.roles.some(({ scope }) => scope === 'organisation') ?? false;
  }

  users: UserFragment[] = [];

  roles: RoleFragment[] = [];

  constructor(
    private service: OrganisationService,
    private authService: AuthenticatedUserService,
    private formBuilder: FormBuilder,
    public ngxSmartModalService: NgxSmartModalService
  ) {
    this.inviteForm = this.formBuilder.group({
      email: ['', { validators: [Validators.email, Validators.required], updateOn: 'blur' }],
      roleId: ['', [Validators.required]],
      organisationId: '',
    });
  }

  ngOnInit(): void {
    this.subs.push(
      this.service.listUsers$().subscribe((users) => {
        if (users) {
          this.users = users;
          this.loaded = true;
        } else {
          this.errored = true;
        }
      }),
      this.authService.authenticatedUser.subscribe((u) => (this.authenticatedUser = u)),
      this.service.listOrgRoles$().subscribe((rs) => (this.roles = rs))
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub?.unsubscribe());
  }

  openInviteModal() {
    this.errors = [];

    this.inviteForm.setValue({
      email: '',
      roleId: '',
      organisationId: this.authenticatedUser?.organisation?.id ?? '',
    });
    this.inviteForm.markAsPristine();
    this.inviteForm.markAsUntouched();

    this.inviteSent = false;
    this.submitted = false;

    this.ngxSmartModalService.getModal('inviteUser').open();
  }

  onSubmitInvite() {
    this.errors = [];

    if (this.submitted) {
      return;
    }

    if (this.inviteForm?.invalid) {
      this.inviteForm.markAllAsTouched();
      return;
    }

    this.submitted = true;

    this.subs.push(
      this.service.inviteUser$(this.inviteEmail, this.inviteRoleId, this.inviteOrganisationId).subscribe((mures) => {
        if (mures.success) {
          this.inviteSent = true;
          this.ngxSmartModalService.getModal('inviteUser').close();
        } else {
          console.warn('Error inviting user', mures.error);
          this.errors = [{ error: mures.error ?? 'There was an issue sending the invite' }];
          this.submitted = false;
        }
      })
    );
  }

  hasError(prop: AbstractControl) {
    return prop.invalid && (prop.dirty || prop.touched);
  }

  getErrorString(prop: AbstractControl) {
    if (prop.errors?.required) {
      return 'This field is required.';
    }
    if (prop.errors?.email) {
      return 'Please enter a valid email address.';
    }
  }

  getError(controlName: string) {
    const prop = this.inviteForm?.get(controlName);
    if (prop && this.hasError(prop)) {
      return this.getErrorString(prop);
    }
  }

  get inviteEmail() {
    return this.inviteForm.get('email')?.value;
  }

  get inviteRoleId() {
    return this.inviteForm.get('roleId')?.value;
  }

  get inviteOrganisationId() {
    return this.inviteForm.get('organisationId')?.value;
  }
}
