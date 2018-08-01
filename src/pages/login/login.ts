import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  Nav,
  Events,
} from 'ionic-angular';
import {
  Facebook,
  FacebookLoginResponse,
} from '../../../node_modules/@ionic-native/facebook';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  userData: any;

  constructor(
    public nav: Nav,
    public navParams: NavParams,
    private facebook: Facebook,
    public navCtrl: NavController,
    public events: Events
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  loginWithFB() {
    this.facebook
      .login(['email', 'public_profile'])
      .then((response: FacebookLoginResponse) => {
        this.facebook
          .api(
            'me?fields=id,name,email,first_name,last_name,picture.width(720).height(720).as(picture_large)',
            []
          )
          .then(profile => {
            console.log('profile::', profile);
            const userProfile = {
              email: profile['email'],
              first_name: profile['first_name'],
              last_name: profile['last_name'],
              picture: profile['picture_large']['data']['url'],
              user_name: profile['name'],
            };
            this.events.publish('user:fb', userProfile);
          });
      });
    this.nav.setRoot(HomePage);
  }
}
