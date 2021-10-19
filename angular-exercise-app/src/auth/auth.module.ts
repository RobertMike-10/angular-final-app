import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

// third-party modules
import { AngularFireModule} from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

// shared modules
import { SharedModule } from './shared/shared.module';

export const ROUTES: Routes = [
  {
    path: 'auth',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule)},
      { path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterModule)},
    ]
  }
];

export const firebaseConfig=  {
    apiKey: "AIzaSyAHkKFEcoBeYeBlDkRSsDRkmWzDPLOHlQ8",
    authDomain: "fitness-app-c6d68.firebaseapp.com",
    databaseURL: "https://fitness-app-c6d68-default-rtdb.firebaseio.com",
    projectId: "fitness-app-c6d68",
    storageBucket: "fitness-app-c6d68.appspot.com",
    messagingSenderId: "184953255392",
    appId: "1:184953255392:web:9d4ac6bfdddf2f43c1a785",
    measurementId: "G-2WRZNP89VE"
};

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    SharedModule.forRoot()
  ]
})
export class AuthModule {}