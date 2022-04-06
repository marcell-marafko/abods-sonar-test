import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormErrors } from 'src/app/shared/gds/error-summary/error-summary.component';
import { AuthenticationService } from '../authentication.service';
@Component({
  selector: 'app-auth-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading = true;
  submitted = false;
  returnUrl?: string;
  authSubscription: Subscription;
  formSubscription?: Subscription;
  errors: FormErrors[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authSubscription = this.authenticationService.isAuthenticated.subscribe((res) => {
      if (res) {
        this.loading = false;
        this.router.navigate([this.returnUrl ?? '/']);
      } else {
        if (this.submitted) {
          this.errors.push({
            error: 'Sign in failed, check username and password.',
            label: 'login-username',
          });
        }
      }
    });
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.formSubscription = this.loginForm.valueChanges.subscribe(() => {
      this.resetForm();
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  private resetForm() {
    this.errors = [];
    this.submitted = false;
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm?.controls;
  }

  onSubmit() {
    this.resetForm();
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm?.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f?.username.value, this.f?.password.value);
  }

  hasError(prop: AbstractControl) {
    return prop.invalid && (prop.dirty || prop.touched);
  }

  getErrorString(prop: AbstractControl) {
    if (prop.errors?.required) {
      return 'This field is required.';
    }
  }

  getError(controlName: string) {
    const prop = this.loginForm?.get(controlName);
    if (prop && this.hasError(prop)) {
      return this.getErrorString(prop);
    }
  }
}
