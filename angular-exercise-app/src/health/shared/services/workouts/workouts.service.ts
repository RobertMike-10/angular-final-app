import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';

import { Observable, of } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { AuthService } from 'src/auth/shared/services/auth/auth.service';
import { Store } from 'store';

export interface Workout{
    name:string,
    type:string, //endurance | strenght
    strenght:any,
    endurance:any,
    timeStamp?: number,
    $key:string,
    $exists?: ()=>boolean
}

@Injectable()
export class WorkoutsService{
    //observable of list from DB of WorkOut

    uid!:string;
    workouts$!:Observable<Workout[]>


    constructor(private store:Store,
        private db:AngularFireDatabase,
        private authService: AuthService){
            //firebase me devuelve una promesa
            this.get_uid().then(user =>{
              this.uid = user.uid;
              this.workouts$=(this.db.list<Workout>(`workouts/${this.uid}`).snapshotChanges() as any)
                  .pipe(

                    map((items:any) => {             // <== new way of chaining
                        return items.map((a:any) => {
                          const data = a.payload.val();
                          const key = a.payload.key;
                          return {key, data};           // or {key, ...data} in case data is Obj
                        });
                    }),
                    tap((next:any) =>{
                       const workouts:Workout[] = next.map((workout:any) => {
                           let obj:Workout ={$key:workout.key,
                                             name:workout.data.name,
                                             type:workout.data.type,
                                             strenght:workout.data.strenght,
                                             endurance:workout.data.endurance};
                           return obj;
                      });
                      this.store.set('workouts',workouts)})) ;
            })


    }

    get_uid(): Promise<any>{
       return this.authService.user;
    }

    addWorkout(workout:Workout):void
    {
        this.db.list<Workout>(`workouts/${this.uid}`).push(workout);
    }

    removeWorkout(key: string) {
        return this.db.list(`workouts/${this.uid}`).remove(key);
      }

    updateWorkout(key: string, workout:Workout){
      return this.db.object(`workouts/${this.uid}/${key}`).update(workout);
    }

    getWorkout(key:string): Observable<{}>| Observable<Workout|undefined>
    {
        if(!key) return of({});
        return this.store.select<Workout[]>('workouts').pipe(
              filter(Boolean) as any,
              map((workouts:Workout[]) => workouts.find((workout:Workout) => workout.$key===key ))
        );
    }

}
