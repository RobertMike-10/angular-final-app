import { Component, Output, EventEmitter, ChangeDetectionStrategy, Input, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
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
              *ngIf="!exists"
              (click)="createMeal()">
              Create meal
            </button>
            <button
              type="button"
              class="button"
              *ngIf="exists"
              (click)="updateMeal()">
              Save
            </button>
            <a
              class="button button--cancel"
              [routerLink]="['../']">
              Cancel
            </a>
          </div>

         <div
           class="meal-form__delete"
           *ngIf="exists">
           <div *ngIf="toggled">
              <p>Delete item?</p>
              <button
                 class="confirm"
                 type="button"
                 (click)="removeMeal()">
              Yes
              </button>
              <button
                 class="cancel"
                 type="button"
                 (click)="toggle()">
               No
              </button>
           </div>
           <button class="button button--delete" type="button" (click)="toggle()">
              Delete
            </button>
          </div>

        </div>

      </form>
    </div>
  `
})
export class MealFormComponent implements OnChanges {

  @Input()
  meal!:Meal;

  @Output()
  create = new EventEmitter<Meal>();

  @Output()
  update = new EventEmitter<Meal>();

  @Output()
  remove = new EventEmitter<Meal>();

  toggled=false;
  exists=false;

  form = this.fb.group({
    name: ['', Validators.required],
    ingredients: this.fb.array([''])
  });

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnChanges(changes:SimpleChanges):void {
    if (this.meal && this.meal.name){
        this.exists = true;
        const value = this.meal;
        this.emptyIngredients();
        this.form.patchValue(value);

        if (value.ingredients){
          value.ingredients.forEach(ingredient => {
            this.ingredients.push(new FormControl(ingredient));
          });
        }
    }
  }

  emptyIngredients():void{
    while(this.ingredients.controls.length){
      this.ingredients.removeAt(0);
    }
  }
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

  updateMeal():void {
    if (this.form.valid) {
      this.update.emit(this.form.value);
    }
  }

  removeMeal():void {
    this.remove.emit(this.form.value);
  }

  toggle():void {
      this.toggled = !this.toggled;
  }

}
