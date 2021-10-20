import { Component } from '@angular/core';
import { MealsService } from 'src/health/shared/services/meals/meals.service';

@Component({
  selector: 'meals',
  styleUrls: ['meals.component.scss'],
  template: `
    <div>
      Meals
    </div>
  `
})
export class MealsComponent {
  constructor(private mealsService:MealsService) {}
}