import { ModuleWithProviders, NgModule } from '@angular/core';


@NgModule({
  imports: [
   
  ],
  declarations: [
   
  ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders<SharedModule> {
        return {
          ngModule: SharedModule,
          providers: [
          
          ]
        };
      }
}