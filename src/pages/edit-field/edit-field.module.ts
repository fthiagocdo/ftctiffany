import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditFieldPage } from './edit-field';

@NgModule({
  declarations: [
    EditFieldPage,
  ],
  imports: [
    IonicPageModule.forChild(EditFieldPage),
  ],
})
export class EditFieldPageModule {}
