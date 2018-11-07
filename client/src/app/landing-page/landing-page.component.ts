import { Router } from '@angular/router';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { ShrinkService } from '../shared/services/shrink.service';
import { BadRequestError } from '../shared/errors/bad-request-error';
import { ToastrService } from 'ngx-toastr';

import {
  FormGroup,
  FormBuilder,
  Validators
} from '../../../node_modules/@angular/forms';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  formGroup: FormGroup;
  constructor(
    private service: ShrinkService,
    private router: Router,
    private formBuilder: FormBuilder,
    private notify: ToastrService
  ) {}
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      link: this.formBuilder.control('', Validators.required)
    });
  }
  shrinkLink() {
    this.service.shrink(this.formGroup.value.link).subscribe(
      res => this.router.navigate(['/manager']),
      err => this.handleError(err));
  }

 handleError(err) {
    if (err instanceof BadRequestError) {
      this.notify.error('Invalid link', '', {
        timeOut: 2500,
        positionClass: 'toast-top-left'
      });
    }
  }

  get link() {
    return this.formGroup.get('link');
  }
}
