import { ToastrService } from 'ngx-toastr';
import { Component, Renderer2 } from '@angular/core';
import { IUser } from '../shared/models/user-model';
import { UserService } from '../shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(
    private userService: UserService,
    private router: Router,
    private renderer: Renderer2,
  ) {
    this.renderer.setStyle(
      document.body,
      'background',
      'url("../../assets/imgs/shrink-bkg.svg")'
    );
    this.renderer.setStyle(document.body, 'background-size', 'cover');
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.userService
      .isAuthenticated()
      .subscribe(auth => this.router.navigate(['/home']));
  }
}
