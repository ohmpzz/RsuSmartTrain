import { WeatherPage } from './../weather/weather';
import { TrainPage } from './../train/train';

import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationPage } from '../location/location';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  tab1 = false;
  tab2 = false;
  tab3 = false;

  constructor(public navCtrl: NavController, public geolocation: Geolocation) {}

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    this.geolocation.getCurrentPosition().then(
      position => {
        let latLng = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );

        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
        };

        this.map = new google.maps.Map(
          this.mapElement.nativeElement,
          mapOptions
        );
      },
      err => {
        console.log(err);
      }
    );
  }

  addMarker() {
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter(),
    });

    let content = '<h4>Information!</h4>';

    this.addInfoWindow(marker, content);
  }

  addInfoWindow(marker, content) {
    let infoWindow = new google.maps.InfoWindow({
      content: content,
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  PushTrainPage() {
    this.navCtrl.push(TrainPage);
  }

  star1() {
    console.log('star 1');
    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
  }
  star2() {
    console.log('star 2');
    this.tab1 = false;
    this.tab2 = true;
    this.tab3 = false;
  }
  star3() {
    console.log('star 3');
    this.tab1 = false;
    this.tab2 = false;
    this.tab3 = true;
  }
}
