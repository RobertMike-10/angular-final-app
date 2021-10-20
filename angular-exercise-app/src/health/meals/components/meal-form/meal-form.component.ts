import { Component, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { Meal } from '../../../shared/services/meals/meals.service';

@Component({
  selector: 'meal-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['meal-form.component.scss'],
  template: `
    <div class="meal-form">
      
      <form [formGroup]="form">
        <div class="meal-form__name">
          <label>
            <h3>Meal name</h3>
            <input 
              type="text" 
              placeholder="e.g. English Breakfast" 
              formControlName="name">
            <div class="error" *ngIf="required">
              Workout name is required
            </div>
          </label>
        </div>
        <div class="meal-form__food">
          <div class="meal-form__subtitle">
            <h3>Food</h3>
            <button 
              type="button"
              class="meal-form__add"
              (click)="addIngredient()">
              <img src="/assets/img/add-white.svg">
              Add food
            </button>
          </div>
          <div formArrayName="ingredients">
            <label *ngFor="let c of ingredients.controls; index as i;">
              <input [formControlName]="i" placeholder="e.g. Bacon">
              <span
                class="meal-form__remove"
                (click)="removeIngredient(i)">
              </span>
            </label>
          </div>
        </div>
        <div class="meal-form__submit">
          <div>
            <button
              type="button"
              class="button"
              (click)="createMeal()">
              Create meal
            </button>
            <a 
              class="button button--cancel"
              [routerLink]="['../']">
              Cancel
            </a>
          </div>
        </div>
      </form>
    </div>
  `
})
export class MealFormComponent {

  @Output()
  create = new EventEmitter<Meal>();

  form = this.fb.group({
    name: ['', Validators.required],
    ingredients: this.fb.array([''])
  });
  
  constructor(
    private fb: FormBuilder
  ) {}

  get required():boolean| undefined {
    return (
      this.form.get('name')?.hasError('required') &&
      this.form.get('name')?.touched
    );
  }

  get ingredients():FormArray {
    return this.form.get('ingredients') as FormArray;
  }

  addIngredient():void {
    this.ingredients.push(new FormControl(''));
  }

  removeIngredient(index: number):void  {
    this.ingredients.removeAt(index);
  }

  createMeal():void {
    if (this.form.valid) {
      this.create.emit(this.form.value);
    }
  }

}