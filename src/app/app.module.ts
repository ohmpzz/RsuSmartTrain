import { LocationPage } from './../pages/location/location';
import { TrainPage } from './../pages/train/train';

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import {
  IonicApp,
  IonicErrorHandler,
  IonicModule,
  NavParams,
} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Geolocation } from '@ionic-native/geolocation';

import { LoginPage } from '../pages/login/login';
import { Facebook } from '@ionic-native/facebook';
import { WeatherPage } from '../pages/weather/weather';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    TrainPage,
    WeatherPage,
    LocationPage,
  ],
  imports: [BrowserModule, IonicModule.forRoot(MyApp)],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    TrainPage,
    WeatherPage,
    LocationPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Geolocation,
    Facebook,
  ],
})
export class AppModule {}
