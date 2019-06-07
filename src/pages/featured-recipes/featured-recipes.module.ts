import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeaturedRecipesPage } from './featured-recipes';

@NgModule({
  declarations: [
    FeaturedRecipesPage,
  ],
  imports: [
    IonicPageModule.forChild(FeaturedRecipesPage),
  ],
})
export class FeaturedRecipesPageModule {}
