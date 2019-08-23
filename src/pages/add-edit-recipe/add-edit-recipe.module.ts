import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddEditRecipePage } from './add-edit-recipe';

@NgModule({
  declarations: [
    AddEditRecipePage,
  ],
  imports: [
    IonicPageModule.forChild(AddEditRecipePage),
  ],
})
export class AddEditRecipePageModule {}
