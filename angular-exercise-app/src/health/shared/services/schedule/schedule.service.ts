import { CompileShallowModuleMetadata } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { AuthService } from 'src/auth/shared/services/auth/auth.service';
import { Store } from 'store';
import { Meal } from '../meals/meals.service';
import { Workout } from '../workouts/workouts.service';

export interface ScheduleItem {
  meals: Meal[] | null,
  workouts: Workout[]  | null,
  section: string,
  timestamp?: number,
  $key?: string
}

export interface ScheduleList {
  morning?: ScheduleItem,
  lunch?: ScheduleItem,
  evening?: ScheduleItem,
  snacks?: ScheduleItem,
  [key: string]: any
}

@Injectable()
export class ScheduleService{

  private date$ = new BehaviorSubject(new Date());
  private section$ = new Subject();
  private itemList$ = new Subject();
  uid!:string;
  schedule$!: Observable<ScheduleItem[]>

  selected$ = this.section$.pipe(
    tap((next: any) => this.store.set('selected', next)));

  list$ = this.section$.pipe(
                map((value: any) => this.store.value[value.type]),
                tap((next: any) =>  this.store.set('list', next)));

  items$ = this.itemList$.pipe(
                withLatestFrom(this.section$),
                map(([ items, section ]: any[]) => {

                  const id = section.data.$key;
                  const defaults: ScheduleItem = {
                    workouts: null,
                    meals: null,
                    section: section.section,
                    timestamp: new Date(section.day).getTime()
                  };
                  //asign the payload conditional, for a new object
                  const payload = {
                    ...(id ? section.data : defaults),
                    ...items
                  };

                  if (id) {
                    return this.updateSection(id, payload);
                  } else {
                    return this.createSection(payload);
                  }
                }));

  constructor(
    private authService: AuthService,
    private store: Store,
    private db: AngularFireDatabase
  ) {

     //firebase me devuelve una promesa
     this.get_uid().then(user =>{
      this.uid = user.uid;
      this.schedule$= this.date$.pipe(
        tap((next: any) => this.store.set('date', next)),
        map((day: Date) => {
        const startAt = (
          new Date(day.getFullYear(), day.getMonth(), day.getDate())
        ).getTime();
        const endAt = (
          new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1)
        ).getTime() -1;
        return { startAt, endAt };
        }),
        switchMap(({ startAt, endAt }: any):any => {
          return this.getSchedule(startAt, endAt)}), //fetching data from firebase
        map((items:any) =>
             items.map((a:any) => {
              const data = a.payload.val();
              const key = a.payload.key;
              return {key, data};           // or {key, ...data} in case data is Obj
            })
          ),
        map((value: any) => {
            const mapped: ScheduleList = {};
            for (const prop of value) {
                if (!mapped[prop.data.section]) {
                  mapped[prop.data.section] = prop.data;
                }
            };

            return mapped as ScheduleItem[];
        }),
       tap((next: any) => this.store.set('schedule', next))

      );//fin del pipe

     }); //fin del then
  }

  updateDate(date:Date):void{
    this.date$.next(date);
  }

  selectSection(event: any):void {
    this.section$.next(event);
  }

  get_uid(): Promise<any>{
    return this.authService.user;
 }

  private getSchedule(startAt: number, endAt: number) {
    return this.db.list(`schedule/${this.uid}`,
           ref => ref.orderByChild('timestamp').startAt(startAt).endAt(endAt)).snapshotChanges();
  }

  updateItems(items: string[]):void {
    this.itemList$.next(items);

  }

  private createSection(payload: ScheduleItem) {
    return this.db.list(`schedule/${this.uid}`).push(payload);
  }

  private updateSection(key: string, payload: ScheduleItem) {
    return this.db.object(`schedule/${this.uid}/${key}`).update(payload);
  }

}
