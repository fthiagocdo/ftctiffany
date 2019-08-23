import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { FeaturedRecipesPage } from '../pages/featured-recipes/featured-recipes';
import { FavoriteRecipesPage } from '../pages/favorite-recipes/favorite-recipes';

import * as firebase from 'firebase';
import { PreloaderProvider } from '../providers/preloader/preloader';
import { AuthService } from '../providers/auth/auth-service';
import { Utils } from '../providers/utils/utils';
import { ImageLoaderConfig } from 'ionic-image-loader';
import { MyRecipesPage } from '../pages/my-recipes/my-recipes';
import { SearchRecipePage } from '../pages/search-recipe/search-recipe';
import { DatabaseProvider } from '../providers/database/database';
import { CategoryProvider } from '../providers/category/category';

export const firebaseConfig = {
  apiKey: "AIzaSyDSV0S6hd_L1cZxQYggB6XNSS-MSkcNqHc",
  authDomain: "projeto-tiffany.firebaseapp.com",
  databaseURL: "https://projeto-tiffany.firebaseio.com",
  projectId: "projeto-tiffany",
  storageBucket: "projeto-tiffany.appspot.com",
  messagingSenderId: "249520959531",
  appId: "1:249520959531:web:86616bdd99cb73aa"
};

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  private rootPage: any = LoginPage;
  private pagesGuest: Array<{title: string, icon: string, component: any}>;
  private pagesUser: Array<{title: string, icon: string, component: any}>;
  private email = 'tiffanydatabase@mail.com';
  private password = 'FrbS@197569';
  private currentUser: any;
  
  constructor(
    private PLATFORM: Platform, 
    private STATUSBAR: StatusBar, 
    private SPLASHSCREEN: SplashScreen,
    private AUTH : AuthService, 
    private LOADER: PreloaderProvider,
    private IMGLOADERCONFIG: ImageLoaderConfig,
    private UTILS: Utils,
    private DB: DatabaseProvider,
    private CATEGORY: CategoryProvider,
    ) {
    
      this.initializeApp();

      this.AUTH.activeUser.subscribe((_user)=>{
        this.currentUser = _user;
      });

      
  }

  loadData() {
    let _class = this;

    this.DB.getCategories()
      .then(success => {
        _class.CATEGORY.set(success);
      }, err => {
        console.log(err.message);
        _class.UTILS.showMessage('Não foi possível se conectar ao banco de dados. Por favor, tente novamente mais tarde...', 'error');
      });
    this.pagesGuest = [
      { title: 'Procurar receitas', icon: 'search', component: SearchRecipePage },
      { title: 'Receitas em destaque', icon: 'star', component: FeaturedRecipesPage  },
      { title: 'Login', icon: 'log-in', component: LoginPage  }
    ];
    this.pagesUser = [
      { title: 'Procurar receitas', icon: 'search', component: SearchRecipePage },
      { title: 'Receitas favoritas', icon: 'heart', component: FavoriteRecipesPage },
      { title: 'Minhas receitas', icon: 'list-box', component: MyRecipesPage },
      { title: 'Receitas em destaque', icon: 'star', component: FeaturedRecipesPage },
      { title: 'Sair', icon: 'log-out', component: LoginPage  }
    ];
  }

  initializeApp() {
    this.PLATFORM.ready().then(() => {
      this.STATUSBAR.backgroundColorByHexString('#cf1717');
      this.SPLASHSCREEN.hide();
      this.IMGLOADERCONFIG.enableSpinner(true);
      this.IMGLOADERCONFIG.useImageTag(true);
      this.IMGLOADERCONFIG.setFallbackUrl('assets/imgs/recipe_loading.jpg');

      this.connectToDatabase();
    });
  }

  openPage(page) {
    if(page.title == 'Sair'){
      this.AUTH.doLogout();
      this.connectToDatabase();
      this.nav.setRoot(LoginPage);
    }else{
      this.LOADER.displayPreloader();
      this.nav.setRoot(page.component);
    }
  }

  connectToDatabase() {
    let _class = this;
    this.LOADER.displayPreloader();
    firebase.auth().signInWithEmailAndPassword(this.email, this.password)
      .then((credentials) => {
        this.loadData();
        _class.LOADER.hidePreloader();
      }).catch((err) => {
        console.log(err.message);
        _class.UTILS.showMessage('Não foi possível se conectar ao banco de dados. Por favor, tente novamente mais tarde...', 'error');
        _class.LOADER.hidePreloader();
      });
  }
}
