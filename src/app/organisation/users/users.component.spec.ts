import { APP_BASE_HREF } from '@angular/common';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { byLabel, byText, byTextContent, createHostFactory, SpectatorHost } from '@ngneat/spectator';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { of } from 'rxjs';
import { AuthenticatedUserService } from 'src/app/authentication/authenticated-user.service';
import { LayoutModule } from 'src/app/layout/layout.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScopeEnum } from 'src/generated/graphql';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { OrganisationModule } from '../organisation.module';
import { OrganisationService } from '../organisation.service';

import { UsersComponent } from './users.component';

const orgRoles = [
  {
    id: '2',
    scope: ScopeEnum.Organisation,
    name: 'Administrator',
  },

  {
    id: '4',
    scope: ScopeEnum.Organisation,
    name: 'Staff',
  },
];

describe('UsersComponent', () => {
  let spectator: SpectatorHost<UsersComponent>;
  const createHost = createHostFactory({
    component: UsersComponent,
    imports: [
      SharedModule,
      LayoutModule,
      ApolloTestingModule,
      NgxSmartModalModule.forChild(),
      OrganisationModule,
      RouterTestingModule.withRoutes([
        {
          path: '',
          component: UsersComponent,
        },
        {
          path: 'edit/:email',
          component: EditUserComponent,
        },
      ]),
    ],
    providers: [{ provide: APP_BASE_HREF, useValue: '/users' }],
    detectChanges: false,
  });

  let service: OrganisationService;
  let router: Router;
  let authService: AuthenticatedUserService;

  beforeEach(() => {
    spectator = createHost(`<app-users> </app-users>`);
    service = spectator.inject(OrganisationService);
    router = spectator.inject(Router);
    authService = spectator.inject(AuthenticatedUserService);

    spyOn(service, 'listOrgRoles$').and.returnValue(of(orgRoles));
  });

  it('should create', () => {
    spectator.detectChanges();

    expect(spectator.component).toBeTruthy();
  });

  it('should request list of users', () => {
    const listUsersSpy = spyOn(service, 'listUsers$').and.returnValue(of([]));

    spectator.detectChanges();

    expect(listUsersSpy).toHaveBeenCalledWith();
  });

  it('should list users returned by service', () => {
    const people = [
      {
        id: '1',
        email: 'dennis@iwbaotn.uk',
        username: 'dennis@iwbaotn.uk',
        firstName: 'Dennis',
        lastName: 'Nordon',
        roles: [
          {
            id: '4',
            scope: ScopeEnum.Organisation,
            name: 'Staff',
          },
        ],
      },
      {
        id: '2',
        email: 'Kenneth@Horne.uk',
        username: 'Kenneth@Horne.uk',
        firstName: 'Kenneth',
        lastName: 'Horne',
        roles: [
          {
            id: '2',
            scope: ScopeEnum.Organisation,
            name: 'Admin',
          },
        ],
      },
      {
        id: '3',
        email: 'betty.marsden@mail.co.uk',
        username: 'betty.marsden@mail.co.uk',
        firstName: 'Betty',
        lastName: 'Marsden',
        roles: [
          {
            id: '4',
            scope: ScopeEnum.Organisation,
            name: 'Staff',
          },
        ],
      },
    ];

    spyOn(service, 'listUsers$').and.returnValue(of(people));

    spectator.detectChanges();

    const rows = spectator.queryAll('.govuk-table__body .govuk-table__row');

    expect(rows).toHaveLength(3);

    people.forEach((person, i) => {
      expect(
        spectator.query(
          byTextContent(new RegExp(`${person.firstName} ${person.lastName}`), {
            selector: `.govuk-table__body .govuk-table__row:nth-of-type(${i + 1})`,
          })
        )
      ).toBeTruthy();

      expect(
        spectator.query(
          byTextContent(new RegExp(person.email), {
            selector: `.govuk-table__body .govuk-table__row:nth-of-type(${i + 1})`,
          })
        )
      ).toBeTruthy();

      expect(
        spectator.query(
          byTextContent(new RegExp(person.roles[0].name), {
            selector: `.govuk-table__body .govuk-table__row:nth-of-type(${i + 1})`,
          })
        )
      ).toBeTruthy();
    });
  });

  it('should allow an admin to edit a user', async () => {
    const person = {
      id: '2',
      email: 'dennis@iwbaotn.uk',
      username: 'dennis@iwbaotn.uk',
      firstName: 'Dennis',
      lastName: 'Nordon',
      roles: [
        {
          id: '4',
          scope: ScopeEnum.Organisation,
          name: 'Staff',
        },
      ],
    };

    spyOnProperty(authService, 'authenticatedUser').and.returnValue(
      of({
        roles: [{ name: 'Administrator' }],
      })
    );
    spyOn(service, 'listUsers$').and.returnValue(of([person]));

    spectator.detectChanges();
    await spectator.fixture.whenStable();

    const editLink = spectator.query(
      byText('Edit', { selector: '.govuk-table__body .govuk-table__row .govuk-table__cell a' })
    );

    expect(editLink).toBeTruthy();

    if (editLink) {
      const spy = spyOn(router, 'navigateByUrl');

      spectator.click(editLink);

      await spectator.fixture.whenStable();

      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(spy.calls.mostRecent().args[0].toString()).toEqual(`/edit/${person.username}`);
    }
  });

  it('should not allow a staff user to edit a user', async () => {
    const person = {
      id: '6',
      email: 'dennis@iwbaotn.uk',
      username: 'dennis@iwbaotn.uk',
      firstName: 'Dennis',
      lastName: 'Nordon',
      roles: [
        {
          id: '4',
          scope: ScopeEnum.Organisation,
          name: 'Staff',
        },
      ],
    };

    spyOnProperty(authService, 'authenticatedUser').and.returnValue(
      of({
        roles: [{ name: 'Staff' }],
      })
    );
    spyOn(service, 'listUsers$').and.returnValue(of([person]));

    spectator.detectChanges();
    await spectator.fixture.whenStable();

    const editLink = spectator.query(
      byText('Edit', { selector: '.govuk-table__body .govuk-table__row .govuk-table__cell a' })
    );

    expect(editLink).toBeFalsy();
  });

  it('should allow org admin to invite a new user', async () => {
    const organisationId = '43';
    const inviteEmail = 'email@domain.com';
    const inviteRole = orgRoles[1];

    spyOnProperty(authService, 'authenticatedUser').and.returnValue(
      of({
        roles: [{ name: 'Administrator', scope: 'organisation' }],
        organisation: { id: organisationId },
      })
    );

    spectator.detectChanges();
    await spectator.fixture.whenStable();

    const inviteButton = spectator.query(byText('Invite a new user', { selector: 'button' }));

    expect(inviteButton).toBeTruthy();

    if (inviteButton) {
      spectator.click(inviteButton);

      expect(spectator.query(byTextContent(/Invite a user/, { selector: '.modal' }))).toBeTruthy();

      spectator.typeInElement(inviteEmail, byLabel('Email address'));
      spectator.blur(byLabel('Email address'));
      spectator.click(byLabel(inviteRole.name));

      const inviteUserSpy = spyOn(service, 'inviteUser$').and.returnValue(of({ success: true }));

      spectator.click(byText('Invite user'));

      expect(inviteUserSpy).toHaveBeenCalledTimes(1);
      expect(inviteUserSpy).toHaveBeenCalledWith(inviteEmail, inviteRole.id, organisationId);

      expect(spectator.query(byText(/Invite sent/))).toBeTruthy();
    }
  });

  it('should not allow org staff to invite a new user', async () => {
    const organisationId = '43';

    spyOnProperty(authService, 'authenticatedUser').and.returnValue(
      of({
        roles: [{ name: 'Staff', scope: 'organisation' }],
        organisation: { id: organisationId },
      })
    );

    spectator.detectChanges();
    await spectator.fixture.whenStable();

    const inviteButton = spectator.query(byText('Invite a new user', { selector: 'button' }));

    expect(inviteButton).toBeFalsy();
  });

  const openInviteModal = async (organisationId = '43') => {
    spyOnProperty(authService, 'authenticatedUser').and.returnValue(
      of({
        roles: [{ name: 'Administrator', scope: 'organisation' }],
        organisation: { id: organisationId },
      })
    );

    spectator.detectChanges();
    await spectator.fixture.whenStable();

    spectator.click(byText('Invite a new user', { selector: 'button' }));
  };

  it('should validate invite email', async () => {
    await openInviteModal();

    const inviteUserSpy = spyOn(service, 'inviteUser$').and.returnValue(of({ success: true }));
    spectator.typeInElement('thisisnotanemailaddress', byLabel('Email address'));
    spectator.blur(byLabel('Email address'));

    spectator.click(byLabel('Staff'));

    spectator.click(byText('Invite user'));

    expect(inviteUserSpy).toHaveBeenCalledTimes(0);
    expect(spectator.query(byText(/valid email address/))).toBeTruthy();
  });

  it('should require invite email', async () => {
    await openInviteModal();

    const inviteUserSpy = spyOn(service, 'inviteUser$').and.returnValue(of({ success: true }));
    spectator.click(byLabel('Staff'));

    spectator.click(byText('Invite user'));

    expect(inviteUserSpy).toHaveBeenCalledTimes(0);
    expect(spectator.query(byText('This field is required.'))).toBeTruthy();
  });

  it('should require invite role', async () => {
    await openInviteModal();

    const inviteUserSpy = spyOn(service, 'inviteUser$').and.returnValue(of({ success: true }));
    spectator.typeInElement('this@isanemail.address', byLabel('Email address'));
    spectator.blur(byLabel('Email address'));

    spectator.click(byText('Invite user'));

    expect(inviteUserSpy).toHaveBeenCalledTimes(0);
    expect(spectator.query(byText('This field is required.'))).toBeTruthy();
  });

  it('should show error if invite fails', async () => {
    const errorMessage = 'Invite failed error';

    await openInviteModal();

    spectator.typeInElement('email@address.com', byLabel('Email address'));
    spectator.blur(byLabel('Email address'));

    spectator.click(byLabel('Staff'));

    const consoleWarn = spyOn(console, 'warn');
    spyOn(service, 'inviteUser$').and.returnValue(of({ success: false, error: errorMessage }));

    spectator.click(byText('Invite user'));

    expect(spectator.query(byText(errorMessage))).toBeTruthy();
    expect(consoleWarn).toHaveBeenCalledWith('Error inviting user', errorMessage);
  });
});
