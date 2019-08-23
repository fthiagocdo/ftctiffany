import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IonicImageLoader } from 'ionic-image-loader';
import { FeaturedRecipesPage } from './featured-recipes';

@NgModule({
  declarations: [
    FeaturedRecipesPage,
  ],
  imports: [
    IonicPageModule.forChild(FeaturedRecipesPage),
    IonicImageLoader,
  ],
})
export class FeaturedRecipesPageModule {}
