import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginMailPage } from './login-mail';

@NgModule({
  declarations: [
    LoginMailPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginMailPage),
  ],
})
export class LoginMailPageModule {}
