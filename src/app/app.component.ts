import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { FeaturedRecipesPage } from '../pages/featured-recipes/featured-recipes';
import { AddRecipePage } from '../pages/add-recipe/add-recipe';
import { ModalsPage } from '../pages/modals/modals';

import * as firebase from 'firebase';

export const firebaseConfig = {
  apiKey: "AIzaSyDSV0S6hd_L1cZxQYggB6XNSS-MSkcNqHc",
  authDomain: "projeto-tiffany.firebaseapp.com",
  databaseURL: "https://projeto-tiffany.firebaseio.com",
  projectId: "projeto-tiffany",
  storageBucket: "projeto-tiffany.appspot.com",
  messagingSenderId: "249520959531",
  appId: "1:249520959531:web:333829adc8d28a4f"
};

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = ModalsPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Receitas em destaque', component: FeaturedRecipesPage },
      { title: 'Adiconar receita', component: AddRecipePage },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    firebase.initializeApp(firebaseConfig);
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
