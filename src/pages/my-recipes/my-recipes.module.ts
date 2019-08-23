import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyRecipesPage } from './my-recipes';

@NgModule({
  declarations: [
    MyRecipesPage,
  ],
  imports: [
    IonicPageModule.forChild(MyRecipesPage),
  ],
})
export class MyRecipesPageModule {}
