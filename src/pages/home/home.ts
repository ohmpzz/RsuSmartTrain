import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { AngularFirestore } from 'angularfire2/firestore';

import { map } from 'rxjs/operators';

declare var google;

interface BusStop {
  id?: string;
  coords?: any[];
  stopName?: string;
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild('map')
  mapElement: ElementRef;
  map: any;

  tab1 = false;

  tab2 = false;

  tab3 = false;

  busStops: BusStop[];
  test: BusStop;

  constructor(
    private afs: AngularFirestore,
    public navCtrl: NavController,
    public geolocation: Geolocation,
    private modal: ModalController
  ) {}

  ionViewDidLoad() {
    this.getBusStops().subscribe((stop: BusStop[]) => {
      this.busStops = stop;
      console.log(stop);
    });
    this.loadMap();
  }

  getBusStops() {
    return this.afs
      .collection<BusStop>('busStops')
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            return {
              id: a.payload.doc.id,
              ...(a.payload.doc.data() as BusStop),
            };
          });
        })
      );
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

        this.addMarker();
      },
      err => {
        console.log(err);
      }
    );
  }

  addMarker() {
    let myLatLng = { lat: 13.894287, lng: 100.606424 };
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: myLatLng,
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

  openTrainTab() {
    console.log('star 1');
    if (this.tab1 == false) {
      this.tab1 = true;
    } else {
      this.tab1 = false;
    }
    this.tab2 = false;
    this.tab3 = false;
  }

  openLocationTab() {
    console.log('star 2');
    if (this.tab2 == false) {
      this.tab2 = true;
    } else {
      this.tab2 = false;
    }
    this.tab1 = false;
    this.tab3 = false;
  }

  openWeatherTab() {
    console.log('star 3');
    if (this.tab3 == false) {
      this.tab3 = true;
    } else {
      this.tab3 = false;
    }
    this.tab2 = false;
    this.tab1 = false;
  }
}
