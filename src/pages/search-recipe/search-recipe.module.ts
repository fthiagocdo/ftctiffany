import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchRecipePage } from './search-recipe';

@NgModule({
  declarations: [
    SearchRecipePage,
  ],
  imports: [
    IonicPageModule.forChild(SearchRecipePage),
  ],
})
export class SearchRecipePageModule {}
