import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { FeaturedRecipesPage } from '../pages/featured-recipes/featured-recipes';
import { AddRecipePage } from '../pages/add-recipe/add-recipe';
import { ModalsPage } from '../pages/modals/modals';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GooglePlus } from '@ionic-native/google-plus';
import { ImagePicker } from '@ionic-native/image-picker';
import { Camera } from '@ionic-native/camera';
import { AuthService } from '../providers/auth/auth-service';
import { RecipeService } from '../providers/recipe-service/recipe-service';
import { Utils } from '../providers/utils/utils';
import { ImageProvider } from '../providers/image/image';
import { PreloaderProvider } from '../providers/preloader/preloader';
import { DatabaseProvider } from '../providers/database/database';

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
    LoginPage,
    FeaturedRecipesPage,
    AddRecipePage,
    ModalsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    FeaturedRecipesPage,
    AddRecipePage,
    ModalsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    RecipeService,
    Utils,
    GooglePlus,
    ImagePicker,
    Camera,
    ImageProvider,
    PreloaderProvider,
    DatabaseProvider
  ]
})
export class AppModule {}
