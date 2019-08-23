import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchRecipeResultsPage } from './search-recipe-results';

@NgModule({
  declarations: [
    SearchRecipeResultsPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchRecipeResultsPage),
  ],
})
export class SearchRecipeResultsPageModule {}
