import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

declare var google;

interface BusStop {
  id?: string;
  coords?: any[];
  stopName?: string;
}

interface Direction {
  building?: string;
  name?: string;
  coords?: {
    lat?: number;
    lng?: number;
  };
}

@Component({
  selector: 'page-home',

  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild('map')
  mapElement: ElementRef;

  map: any;

  x: number;
  y: number;

  tab1 = false;
  tab2 = false;
  tab3 = false;

  busStops: BusStop[];

  test: BusStop;

  direction: Direction[] = [];
  go: { start?: any; end?: any } = {};

  directionService: any = new google.maps.DirectionsService();
  directionDisplay: any = new google.maps.DirectionsRenderer();

  constructor(
    private afs: AngularFirestore,
    public navCtrl: NavController,
    public geolocation: Geolocation
  ) {}

  async ionViewDidLoad() {
    this.initDirection();
    await this.loadMap();

    this.getBusStops().subscribe((stop: BusStop[]) => {
      if (stop) {
        stop.forEach(s => {
          this.addMarker(+s.coords[0], +s.coords[1], s.stopName);
        });
      }
    });
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
    return new Promise((resolve, reject) => {
      //watchPosition
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

          this.directionDisplay.setMap(this.map);
          // this.addMarker(latitude, longitude, 'You are here');
          this.addMapLine();
          this.showCurrentPostion();
          resolve();
        },

        err => {
          console.log(err);

          reject(err);
        }
      );
    });
  }
  addMapLine() {
    const mapLineCoords = [
      { lat: 13.96585, lng: 100.587298 },
      { lat: 13.964558, lng: 100.587601 },
      { lat: 13.964346, lng: 100.587616 },
      { lat: 13.964184, lng: 100.587539 },
      { lat: 13.964087, lng: 100.587429 },
      { lat: 13.963815, lng: 100.586272 },
      { lat: 13.966047, lng: 100.585674 },
      { lat: 13.966967, lng: 100.585454 },
      { lat: 13.967582, lng: 100.585351 },
      { lat: 13.967854, lng: 100.585334 },
      { lat: 13.967851, lng: 100.586566 },
      { lat: 13.968088, lng: 100.586611 },
      { lat: 13.968253, lng: 100.587355 },
      { lat: 13.968222, lng: 100.587432 },
      { lat: 13.968149, lng: 100.587428 },
      { lat: 13.968105, lng: 100.587363 },
      { lat: 13.968076, lng: 100.587255 },
      { lat: 13.968129, lng: 100.587171 },
      { lat: 13.96821, lng: 100.587161 },
      { lat: 13.968088, lng: 100.586611 },
      { lat: 13.96785, lng: 100.586566 },
      { lat: 13.967617, lng: 100.586525 },
      { lat: 13.966475, lng: 100.586828 },
      { lat: 13.966333, lng: 100.586871 },
      { lat: 13.966152, lng: 100.587145 },
      { lat: 13.96585, lng: 100.587298 },
    ];

    const mapLine = new google.maps.Polyline({
      path: mapLineCoords,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });

    mapLine.setMap(this.map);
  }

  addDirectionService() {
    this.geolocation.watchPosition().subscribe(position => {
      let latLng = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );
      const start = this.direction.find(d => d.building == this.go.start);
      const end = this.direction.find(d => d.building == this.go.end);

      const request = {
        origin: latLng,
        // origin: start.coords,
        //destination: testEnd,
        destination: end.coords,
        travelMode: 'DRIVING',
      };

      this.directionService.route(request, (result, status) => {
        if (status == 'OK') {
          this.directionDisplay.setDirections(result);
        }
      });
    });
  }

  onDirection() {
    // Test ฟังค์ชั่น รับค่าของ addDirectionService
    console.log(this.go);
    const start = this.direction.find(d => d.building == this.go.start);
    const end = this.direction.find(d => d.building == this.go.end);
    console.log('start:::', start.coords);
    console.log('end:::', end.coords);
  }

  showCurrentPostion() {
    this.geolocation.watchPosition().subscribe(position => {
      let latLng = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );

      let marker = new google.maps.Marker({
        map: this.map,
        position: latLng,
      });
      console.log(latLng);
      let content = '<h4>You are here</h4>';
      this.addInfoWindow(marker, content);
    });
  }

  addMarker(lat, lng, stopName) {
    let marker = new google.maps.Marker({
      map: this.map,

      // animation: google.maps.Animation.DROP,

      position: { lat, lng },
    });

    let content = stopName;

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

  private initDirection() {
    this.direction = [
      {
        building: '1',
        name: 'ตึก 1 อาคารอาทิตย์อุไรรัตน์',
        coords: {
          lat: 13.965257,
          lng: 100.586956,
        },
      },
      {
        building: '2',
        name: 'ตึก 2 อาคารประสิทธิรัตน์',
        coords: {
          lat: 13.964132,
          lng: 100.587922,
        },
      },
      {
        building: '3',
        name: 'ตึก 3 อาคารอุไรรัตน์',
        coords: {
          lat: 13.963774,
          lng: 100.586952,
        },
      },
      {
        building: '4',
        name: 'ตึก 4 อาคารวิทยาศาสตร์การแพทย์',
        coords: {
          lat: 13.963568,
          lng: 100.585858,
        },
      },
      {
        building: '5',
        name: 'ตึก 5 อาคารวิษณุรัตน์',
        coords: {
          lat: 13.964534,
          lng: 100.58592,
        },
      },
      {
        building: '6',
        name: 'ตึก 6 อาคาร Student Center',
        coords: {
          lat: 13.964537,
          lng: 100.586878,
        },
      },
      {
        building: '7',
        name: 'ตึก 7 อาคารหอสมุด',
        coords: {
          lat: 13.965715,
          lng: 100.585836,
        },
      },
      {
        building: '8',
        name: 'ตึก 8 อาคารคุณหญิงพัฒนา',
        coords: {
          lat: 13.965025,
          lng: 100.58516,
        },
      },
      {
        building: '9',
        name: 'ตึก 9 อาคารประสิทธิ์พัฒนา',
        coords: {
          lat: 13.965846,
          lng: 100.58551,
        },
      },
      {
        building: '10',
        name: 'ตึก 10 อาคารคณะรังสีเทคนิค',
        coords: {
          lat: 13.966288,
          lng: 100.586243,
        },
      },
      {
        building: '11',
        name: 'ตึก 11 อาคารรัตนคุณากร',
        coords: {
          lat: 13.966287,
          lng: 100.586583,
        },
      },
      {
        building: '12',
        name: 'ตึก 12 อาคารรังสิตประยูรศักดิ์',
        coords: {
          lat: 13.967545,
          lng: 100.585508,
        },
      },
      {
        building: '13',
        name: 'ตึก 13 สำนักงานอาคารและสิ่งแวดล้อม',
        coords: {
          lat: 13.967133,
          lng: 100.584957,
        },
      },
      {
        building: '14',
        name: 'ตึก 14 อาคารนันทนาการ',
        coords: {
          lat: 13.968262,
          lng: 100.587354,
        },
      },
      {
        building: '15',
        name: 'ตึก 15 อาคารดิจิตอล มัลติมีเดีย',
        coords: {
          lat: 13.967861,
          lng: 100.585251,
        },
      },
      {
        building: '16',
        name: 'ตึก 16 อาคารบริการ',
        coords: {
          lat: 13.966853,
          lng: 100.583721,
        },
      },
      {
        building: '17',
        name: 'ตึก 17 อาคารศาลาดนตรีสุริยเทพ',
        coords: {
          lat: 13.967306,
          lng: 100.583691,
        },
      },
      {
        building: '18',
        name: 'ตึก 18 อาคารศาลากวนอิม',
        coords: {
          lat: 13.968128,
          lng: 100.583866,
        },
      },
      {
        building: '19',
        name: 'ตึก 19 อาคารสถาปัตย์',
        coords: {
          lat: 13.968913,
          lng: 100.583886,
        },
      },
    ];
  }
}
