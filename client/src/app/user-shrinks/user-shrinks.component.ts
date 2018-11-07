import { ToastrService } from 'ngx-toastr';
import { BadRequestError } from './../shared/errors/bad-request-error';
import { ShrinkService } from '../shared/services/shrink.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-shrinks',
  templateUrl: './user-shrinks.component.html',
  styleUrls: ['./user-shrinks.component.css']
})
export class UserShrinksComponent implements OnInit {
  editMode;
  link;
  userLink = [];
  constructor(
    private renderer: Renderer2,
    private router: Router,
    private service: ShrinkService,
    private notify: ToastrService
  ) {
    this.renderer.setStyle(
      document.body,
      'background',
      'linear-gradient(to right, var(--bkg-pri) 0%, var(--bkg-sec) 100%)'
    );
  }

  ngOnInit() {
    this.service.getMyshrinks().subscribe(links => {
      this.userLink = links;
    });
  }

  navigate(i) {
    console.log(i);
    this.router.navigateByUrl('https://www.google.com');
  }

  delete(e, index) {
    console.log(e);
    this.service.deleteShrink(e).subscribe(res => console.log(res));
    this.userLink.splice(index, 1);
  }

  edit(id, e) {
    const inputField: HTMLInputElement = document.createElement('input');
    inputField.classList.add('edit-input');
    inputField.placeholder = 'Press Enter to save or ESC to undo';
    inputField.autofocus = true;
    const tableCell = this.getSiblings(e.target.parentElement)[0];
    const p: HTMLElement = tableCell.children[0];
    const currentValue = p.innerText;
    tableCell.removeChild(p);
    tableCell.appendChild(inputField);

    inputField.addEventListener('keyup', event => {
      if (+event.keyCode === 27) {
        // if user pressed ESC
        this.resetTable(currentValue, tableCell);
      }
      if (+event.keyCode === 13) {
        // if user pressed ENTER
        if (!inputField.value) {
          this.resetTable(currentValue, tableCell);
        } else {
          this.service
            .editShrink(id, event.target['value'])
            .subscribe(
              res => this.resetTable(res.original, tableCell),
              err => this.handleError(err)
            );
        }
      }
    });
  }

  getSiblings(elem) {
    const siblings = [];
    let sibling = elem.parentNode.firstChild;
    for (; sibling; sibling = sibling.nextSibling) {
      if (sibling.nodeType !== 1 || sibling === elem) {
        continue;
      }
      siblings.push(sibling);
    }
    return siblings;
  }

  handleError(err) {
    if (err instanceof BadRequestError) {
      this.notify.error('Invalid link', '', {
        timeOut: 2500,
        positionClass: 'toast-bottom-left'
      });
    }
  }

  resetTable(res, tableCell) {
    const p = document.createElement('p');
    p.innerText = res;
    tableCell.removeChild(tableCell.children[0]);
    tableCell.appendChild(p);
    console.log(res);
  }
}
