import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {map} from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';


@Injectable()
export class AuthGuard implements CanActivate{

     constructor( private router: Router, private authService:AuthService){

     }
     
    canActivate(): any  {
        return (this.authService.authState as any).pipe(map(user => {
          if (!user){
              this.router.navigate(['/auth/login']);
          }
          return !!user; //false
        })
        );
    }

     
}