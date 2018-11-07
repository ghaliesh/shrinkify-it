import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private auth: UserService, private router: Router) {}

  canActivate() {
    this.auth.isAuthenticated().subscribe(auth => {
      if (!auth) {
        this.router.navigate(['/']);
        return false;
      }
    });
    return true;
  }
}
