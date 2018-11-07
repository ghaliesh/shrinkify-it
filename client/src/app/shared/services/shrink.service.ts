import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ILink } from '../models/urls-model';
import { UnauthorizedError } from '../errors/unauthorized-error';
import { AppError } from '../errors/app-error';
import { catchError } from 'rxjs/operators';
import { BadRequestError } from '../errors/bad-request-error';
import { NotFound } from '../errors/not-found-error';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShrinkService {
  endpoint = `/api/urls`;
  constructor(private http: HttpClient) {}

  shrink(url) {
    const header = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http
      .post<ILink[]>(
        `${this.endpoint}/create`,
        { original: url },
        { headers: header }
      )
      .pipe(catchError(this.catchError));
  }

  deleteShrink(id) {
    return this.http
      .delete<ILink>(`${this.endpoint}/delete/${id}`)
      .pipe(catchError(this.catchError));
  }

  getMyshrinks() {
    return this.http
      .get<ILink[]>(`${this.endpoint}/mylinks`)
      .pipe(catchError(this.catchError));
  }

  editShrink(id, link) {
    const header = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http
      .put<ILink>(
        `${this.endpoint}/edit/${id}`,
        JSON.stringify({ original: link }),
        {
          headers: header
        }
      )
      .pipe(catchError(this.catchError));
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
}
