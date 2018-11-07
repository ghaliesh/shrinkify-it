import { ToastrService } from 'ngx-toastr';
import { Component, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { UserService } from './shared/services/user.service';
import { IUser } from './shared/models/user-model';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BadRequestError } from './shared/errors/bad-request-error';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public formGroup: FormGroup;
  isLoggedIn;
  user: IUser;
  @ViewChild('registerModel')
  registerModel: ElementRef<HTMLElement>;
  @ViewChild('loginModel')
  loginModel: ElementRef<HTMLElement>;
  constructor(
    private userService: UserService,
    private router: Router,
    private renderer: Renderer2,
    private formBuilder: FormBuilder,
    private notify: ToastrService
  ) {
    this.renderer.setStyle(
      document.body,
      'background',
      'url("../../assets/imgs/shrink-bkg.svg")'
    );
    this.renderer.setStyle(document.body, 'background-size', 'cover');
    this.isLoggedIn = this.userService.isAuthenticated();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      name: this.formBuilder.control(''),
      email: this.formBuilder.control('', [
        Validators.minLength(5),
        Validators.required,
        Validators.email
      ]),
      password: this.formBuilder.control('', [
        Validators.minLength(5),
        Validators.required
      ])
    });

    this.userService
      .isAuthenticated()
      .subscribe(auth => this.router.navigate(['/home']));
  }

  logOut() {
    this.userService.logOut();
  }

  login() {
    const user = {
      email: this.formGroup.value.email,
      password: this.formGroup.value.password
    };
    this.userService
      .login(user)
      .subscribe(res => this.handleSuccess(res, 'close-login'));
  }

  handleSuccess(res, model) {
    localStorage.setItem('x-token', res.token);
    this.router.navigate(['/home']);
    this.notify.success('You have logged in successfully', '', {
      positionClass: 'toast-bottom-left',
      timeOut: 2500
    });
    this.userService.isLoggedIn.next(true);
    this.closeModel({ target: { id: model } });
  }

  handleError(err) {
    if (err instanceof BadRequestError) {
      this.notify.error('Invalid credential', '', {
        timeOut: 2500,
        positionClass: 'toast-bottom-left'
      });
    }
  }

  register() {
    if (this.formGroup.invalid) { return; }
    this.userService
      .registerUser(this.formGroup['value'])
      .subscribe(
        res => this.handleSuccess(res, 'close-register'),
        err => this.handleError(err)
      );
  }

  openModel(e) {
    if (e.target.id === 'register') {
      const model: HTMLElement = this.registerModel.nativeElement;
      model.style.display = 'block';
    } else if (e.target.id === 'login') {
      const model: HTMLElement = this.loginModel.nativeElement;
      model.style.display = 'block';
    }
  }

  closeModel(e) {
    this.formGroup.clearValidators();
    this.formGroup.setValue({ name: '', email: '', password: '' });
    this.formGroup.markAsUntouched();
    if (e.target['id'] === 'close-register') {
      const model: HTMLElement = this.registerModel.nativeElement;
      model.style.display = 'none';
    } else if (e.target['id'] === 'close-login') {
      const model: HTMLElement = this.loginModel.nativeElement;
      model.style.display = 'none';
    }
  }

  get name() {
    return this.formGroup.get('name');
  }

  get password() {
    return this.formGroup.get('password');
  }

  get email() {
    return this.formGroup.get('email');
  }
}
