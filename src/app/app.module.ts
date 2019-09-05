import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { LoginMailPage } from '../pages/login-mail/login-mail';
import { RecoverPasswordPage } from '../pages/recover-password/recover-password';
import { ShowRecipePage } from '../pages/show-recipe/show-recipe';
import { FavoriteRecipesPage } from '../pages/favorite-recipes/favorite-recipes';
import { SearchRecipePage } from '../pages/search-recipe/search-recipe';
import { SearchRecipeResultsPage } from '../pages/search-recipe-results/search-recipe-results';
import { EditFieldPage } from '../pages/edit-field/edit-field';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';
//import { ImagePicker } from '@ionic-native/image-picker';
//import { Camera } from '@ionic-native/camera';
import { IonicImageLoader } from 'ionic-image-loader';

import { AuthService } from '../providers/auth/auth-service';
import { Utils } from '../providers/utils/utils';
import { ImageProvider } from '../providers/image/image';
import { PreloaderProvider } from '../providers/preloader/preloader';
import { DatabaseProvider } from '../providers/database/database';
import { CategoryProvider } from '../providers/category/category';

const firebaseConfig = {
  apiKey: "AIzaSyDSV0S6hd_L1cZxQYggB6XNSS-MSkcNqHc",
  authDomain: "projeto-tiffany.firebaseapp.com",
  databaseURL: "https://projeto-tiffany.firebaseio.com",
  projectId: "projeto-tiffany",
  storageBucket: "projeto-tiffany.appspot.com",
  messagingSenderId: "249520959531",
  appId: "1:249520959531:web:333829adc8d28a4f"
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    LoginMailPage,
    SignupPage,
    RecoverPasswordPage,
    ShowRecipePage,
    FavoriteRecipesPage,
    SearchRecipePage,
    SearchRecipeResultsPage,
    EditFieldPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    IonicImageLoader.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    LoginMailPage,
    SignupPage,
    RecoverPasswordPage,
    ShowRecipePage,
    FavoriteRecipesPage,
    SearchRecipePage,
    SearchRecipeResultsPage,
    EditFieldPage,
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GooglePlus,
    Facebook,
    //ImagePicker,
    //Camera,
    AuthService,
    Utils,
    ImageProvider,
    PreloaderProvider,
    DatabaseProvider,
    CategoryProvider
  ]
})
export class AppModule {}
