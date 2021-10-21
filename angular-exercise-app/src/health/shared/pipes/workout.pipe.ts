import {Pipe, PipeTransform} from '@angular/core';
import { Workout } from '../services/workouts/workouts.service';

@Pipe({
  name:'workout'
})

export class WorkoutPipe implements PipeTransform{
  transform(value:Workout):string{

    if(value.type==='endurance'){
      return `Distance: ${value.endurance.distance + 'km'}, Duration: ${value.endurance.duration + 'mins'}`;
    }
    else{
      return `Weight: ${value.strength.weight + 'km'}, Reps: ${value.endurance.reps}, Sets: ${value.endurance.sets}`
              ;
    }
  }
}
