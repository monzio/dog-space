import { Component,ViewChild, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { AreaCaniDataService} from '../area-cani-data.service';


declare var google: any;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  @ViewChild('map', { static: false }) mapElement: ElementRef;
  map: any;
  address: string;

  areaCaniData = [];
  filteredAreeCani = [];
  isfiltered: boolean;
  fullList: boolean;

  latitude: number;
  longitude: number;

  constructor(
    private router: Router,
    private areaCaniDataService: AreaCaniDataService,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder) {
      fetch('./assets/data/ListaAreeCani.json').then(res => res.json())
      .then(data => {
        this.areaCaniData = data.areeCani;
        this.areaCaniData.forEach(areaCaniElement => {
          const posMaker = {
            lat: areaCaniElement.latitude,
            lng: areaCaniElement.longitude
          };
          const iconMaker = {
            url: 'assets/icon/dog-pointer.png', // image url
            scaledSize: new google.maps.Size(50, 50), // scaled size
          };
          const markerLoop = new google.maps.Marker({
            position: posMaker, //marker position
            map: this.map, //map already created
            title: 'Hello World!',
            icon: iconMaker //custom image
          });
        });
        this.areaCaniDataService.setAreecani(this.areaCaniData);
      });
  }

  searchMaps(event) {
    if (event.target.value.length > 2) {
      const filteredJson = this.areaCaniData.filter((row) => {
        if (row.name.toUpperCase().indexOf(event.target.value.toUpperCase()) !== -1) {
          return true;
        } else {
          return false;
        }
      });
      this.isfiltered = true;
      this.filteredAreeCani = filteredJson;
    }
    else {
      this.isfiltered = false;
    }
  }

  getAreaCaniDetails(areaCani) {
    this.areaCaniDataService.setAreaCani(areaCani);
    this.router.navigate(['/museum-detail']);
  }

  toggleMostraTutteAreeCani() {
    this.fullList = ! this.fullList;
  }

  ngOnInit() {
    this.loadMap();
  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((resp) => {

      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;

      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        const pos = {
          lat: resp.coords.latitude,
          lng: resp.coords.longitude
        };
        const icon = {
          url: 'assets/icon/dog-pointer.png', // image url
          scaledSize: new google.maps.Size(50, 50), // scaled size
        };
        const marker = new google.maps.Marker({
          position: pos, //marker position
          map: this.map, //map already created
          title: 'Hello World!',
          icon: icon //custom image
        });

        const contentString = '<div id="content">' +
    '<div id="siteNotice">' +
    '</div>' +
    '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
    '<div id="bodyContent">' +
    '<img src="assets/icon/user.png" width="200">' +
    '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
    'sandstone rock formation in the southern part of the ' +
    'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) ' +
    'south west of the nearest large town, Alice Springs; 450&#160;km ' +
    '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major ' +
    'features of the Uluru - Kata Tjuta National Park. Uluru is ' +
    'sacred to the Pitjantjatjara and Yankunytjatjara, the ' +
    'Aboriginal people of the area. It has many springs, waterholes, ' +
    'rock caves and ancient paintings. Uluru is listed as a World ' +
    'Heritage Site.</p>' +
    '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
    'https://en.wikipedia.org/w/index.php?title=Uluru</a> ' +
    '(last visited June 22, 2009).</p>' +
    '</div>' +
    '</div>';

    const infowindow = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 400
    });

    marker.addListener('click', function() {
      infowindow.open(this.map, marker);
    });

      this.map.addListener('dragend', () => {

        this.latitude = this.map.center.lat();
        this.longitude = this.map.center.lng();

        this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
      });

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  getAddressFromCoords(lattitude, longitude) {
    console.log("getAddressFromCoords " + lattitude + " " + longitude);
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.address = "";
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if (value.length > 0)
            responseAddress.push(value);

        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.address += value + ", ";
        }
        this.address = this.address.slice(0, -2);
      })
      .catch((error: any) => {
        this.address = "Address Not Available!";
      });

  }

}
