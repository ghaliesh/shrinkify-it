import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../models/user-model';
import { throwError } from 'rxjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from '../../../../node_modules/ngx-toastr';
import { NotFound } from '../errors/not-found-error';
import { BadRequestError } from '../errors/bad-request-error';
import { UnauthorizedError } from '../errors/unauthorized-error';
import { AppError } from '../errors/app-error';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user;

  endPoint = `/api/users`;
  isLoggedIn = new BehaviorSubject<Boolean>(this.hasToken());
  constructor(
    private http: HttpClient,
    private router: Router,
    private notify: ToastrService
  ) {}

  registerUser(user: IUser) {
    return this.http
      .post<IUser>(`${this.endPoint}/register`, user)
      .pipe(catchError(this.catchError));
  }

  login(user) {
    return this.http.post(`${this.endPoint}/login`, user);
  }

  hasToken() {
    return !!localStorage.getItem('x-token');
  }

  logOut() {
    localStorage.removeItem('x-token');
    this.isLoggedIn.next(false);
    this.router.navigate(['/']);
    this.notify.warning('You have been logged out', '', {
      positionClass: 'toast-bottom-left',
      timeOut: 2500
    });
  }

  private catchError(error: Response) {
    if (error.status === 404) {
      return throwError(new NotFound());
    } else if (error.status === 400) {
      return throwError(new BadRequestError(error.body));
    } else if (error.status === 401 || error.status === 403) {
      return throwError(new UnauthorizedError());
    } else {
      return throwError(new AppError());
    }
  }

  isAuthenticated() {
    return this.isLoggedIn.asObservable();
  }
}
