import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';


import { RegisterForm } from '../interface/register-form.interface';
import { LoginForm } from '../interface/login-form.interface';


const base_url = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone) {
    this.googleInit();
  }

  googleInit() {

    return new Promise(resolve => {
      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '399475211095-qt265j3hitt1tv1ofp2r1torqle7ko05.apps.googleusercontent.com',
          cookiepolice: 'single_host_origin'
        });

        resolve();
      });
    })

  }

  logout(): void {
    localStorage.removeItem('token');

    this.auth2.singOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });
  }

  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';
    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap((resp: any) => {
        localStorage.setItem('token', resp.token);
      }),
      map(resp => true),
      catchError(error => of(false) )
    );
  }

  crearUsuario(formData: RegisterForm) {

    return this.http.post(`${ base_url }/usuarios`, formData)
                    .pipe(
                      tap( (resp: any) => {
                        localStorage.setItem('token', resp.token);
                      })
                    )
  }

  login(formData: LoginForm ) {

    return this.http.post(`${ base_url }/login`, formData)
                    .pipe(
                      tap( (resp: any) => {
                        localStorage.setItem('token', resp.token);
                      })
                    )

  }

  loginGoogle( token: string) {

    return this.http.post(`${ base_url }/login/google`, { token })
                    .pipe(
                      tap( (resp: any) => {
                        localStorage.setItem('token', resp.token);
                      })
                    )

  }
}
