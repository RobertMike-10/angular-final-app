import { Injectable } from '@angular/core';

import { Store } from 'store';

import {tap} from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, OperatorFunction } from 'rxjs';

export interface User {
  email: string,
  uid: string,
  authenticated: boolean
}

@Injectable()
export class AuthService {


  constructor(
    private store: Store,
    private af: AngularFireAuth
  ) {}

  
  auth$ =(this.af.authState as any).pipe(tap((next:any) => {
    if (!next) {
      this.store.set('user', null);
      return;
    }
    const user: User = {
      email: next.email,
      uid: next.uid,
      authenticated: true
    };
    this.store.set('user', user);
  })
  );

  get user(){
      
  }
  get authState(){
   return this.af.authState;
  }
  createUser(email: string, password: string) {
      
    return this.af.createUserWithEmailAndPassword(email, password);
  }

  loginUser(email: string, password: string) {
    return this.af.signInWithEmailAndPassword(email, password);
  }

  logoutUser() {
    return this.af.signOut();
  }

}