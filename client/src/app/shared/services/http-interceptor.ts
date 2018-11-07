import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from '@angular/common/http';
import { UserService } from './user.service';

@Injectable()
export class Intercept implements HttpInterceptor {
  constructor(private userService: UserService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('x-token');
    const modified = req.clone({ setHeaders: { 'x-token': token || '' } });
    return next.handle(modified);
  }
}
