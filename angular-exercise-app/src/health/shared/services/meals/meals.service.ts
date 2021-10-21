import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';

import { Observable, of } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { AuthService } from 'src/auth/shared/services/auth/auth.service';
import { Store } from 'store';

export interface Meal{
    name:string,
    ingredients: string[],
    timeStamp?: number,
    $key:string,
    $exists?: ()=>boolean
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
              this.meals$=(this.db.list<Meal>(`meals/${this.uid}`).snapshotChanges() as any)
                  .pipe(

                    map((items:any) => {             // <== new way of chaining
                        return items.map((a:any) => {
                          const data = a.payload.val();
                          const key = a.payload.key;
                          return {key, data};           // or {key, ...data} in case data is Obj
                        });
                    }),
                    tap((next:any) =>{
                       const meals:Meal[] = next.map((meal:any) => {
                           let obj:Meal ={$key:meal.key,name:meal.data.name, ingredients:meal.data.ingredients };
                           return obj;
                      });
                      this.store.set('meals',meals)})) ;
            })


    }

    get_uid(): Promise<any>{
       return this.authService.user;
    }

    addMeal(meal:Meal):void
    {
        this.db.list<Meal>(`meals/${this.uid}`).push(meal);
    }

    removeMeal(key: string) {
        return this.db.list(`meals/${this.uid}`).remove(key);
      }

    updateMeal(key: string, meal:Meal){
      return this.db.object(`meals/${this.uid}/${key}`).update(meal);
    }

    getMeal(key:string): Observable<{}>| Observable<Meal|undefined>
    {
        if(!key) return of({});
        return this.store.select<Meal[]>('meals').pipe(
              filter(Boolean) as any,
              map((meals:Meal[]) => meals.find((meal:Meal) => meal.$key===key ))
        );
    }

}
