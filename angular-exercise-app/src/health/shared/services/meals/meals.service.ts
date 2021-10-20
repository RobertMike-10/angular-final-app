import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/shared/services/auth/auth.service';
import { Store } from 'store';


@Injectable()
export class MealsService{

    meals$!: Observable<any> = this.db.list(`meals/${this.uid}`);

    constructor(private store:Store,
        private db:AngularFireDatabase,
        private authService: AuthService){

    }

    get uid(){
        return this.authService
    }
}