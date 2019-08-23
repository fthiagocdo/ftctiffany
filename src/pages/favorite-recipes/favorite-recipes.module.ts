import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FavoriteRecipesPage } from './favorite-recipes';

@NgModule({
  declarations: [
    FavoriteRecipesPage,
  ],
  imports: [
    IonicPageModule.forChild(FavoriteRecipesPage),
  ],
})
export class FavoriteRecipesPageModule {}
