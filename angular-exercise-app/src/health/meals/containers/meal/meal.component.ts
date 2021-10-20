import { Component } from '@angular/core';

import { Meal, MealsService } from '../../../shared/services/meals/meals.service';

@Component({
  selector: 'meal',
  styleUrls: ['meal.component.scss'],
  template: `
    <div class="meal">
      <div class="meal__title">
        <h1>
          <img src="./assets/img/food.svg">
          <span>Create meal</span>
        </h1>
      </div>
      <div>
        <meal-form
          (create)="addMeal($event)">
        </meal-form>
      </div>
    </div>
  `
})
export class MealComponent {
  
  constructor(private mealsService: MealsService,
              private router: Router) {}

  addMeal(event: Meal) {
    console.log('Meal:', event);
  }

}