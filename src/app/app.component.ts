import { LoginPage } from './../pages/login/login';
import { Component, ViewChild} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Nav, Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {

    this.pages = [
      { title: 'Home', component: HomePage },
    ];

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });

  }

  openPageSideMenu(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  openPage(){
    this.nav.setRoot(LoginPage);
  }

  openContactPage(){
    window.open("http://google.com",'_system', 'location=yes');
  }
}


