import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

//third party modules
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
//services
import {MealsService} from './services/meals/meals.service'
import {WorkoutsService} from './services/workouts/workouts.service'
import {ScheduleService} from './services/schedule/schedule.service'
//pipes
import {JoinPipe} from './pipes/join.pipe'
import {WorkoutPipe} from './pipes/workout.pipe'
//components
import {ListItemComponent} from './components/list-item/list-item.component'
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    AngularFireDatabaseModule
  ],
  declarations: [
    ListItemComponent,
    JoinPipe,
    WorkoutPipe
  ],
  exports: [
    ListItemComponent,
    JoinPipe,
    WorkoutPipe
  ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders<SharedModule> {
        return {
          ngModule: SharedModule,
          providers: [
            MealsService,
            WorkoutsService,
            ScheduleService
          ]
        };
      }
}
