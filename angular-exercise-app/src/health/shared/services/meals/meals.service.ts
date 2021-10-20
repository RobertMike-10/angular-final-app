import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/auth/shared/services/auth/auth.service';
import { Store } from 'store';

export interface Meal{
    name:string,
    ingredients: string[],
    timeStamp: number,
    $key:string,
    $exists: ()=>boolean
}

@Injectable()
export class MealsService{
    //observable of list from DB of Meal

    uid!:string;
    meals$!:Observable<Meal[]>

    
    constructor(private store:Store,
        private db:AngularFireDatabase,
        private authService: AuthService){
            //firebase me devuelve una promesa
            this.get_uid().then(user =>{
              this.uid = user.uid;
              this.meals$=(this.db.list<Meal>(`meals/${this.uid}`).valueChanges() as any)
                  .pipe( tap(next =>{                 
                             this.store.set('meals',next)})) ;
            })
       
            
    }

    get_uid(): Promise<any>{
       return this.authService.user;
    }

    addMeal(meal:Meal)
    {
        this.db.list<Meal>(`meals/${this.uid}`).push(meal);
    }
   
    removeMeal(key: string) {
        return this.db.list(`meals/${this.uid}`).remove(key);
      }

}