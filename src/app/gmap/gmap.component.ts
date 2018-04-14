import {Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormControl} from '@angular/forms';
import {} from 'googlemaps';
import {MapsAPILoader} from '@agm/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {GMapAddress} from '../shared/model/gmap-address.model';


const zoomDefault = 21;

@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GmapComponent implements OnInit {
  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
  public markerLat: number;
  public markerLong: number;
  public markerAddress: string;
  public geocoder: google.maps.Geocoder;

  @Output() addressSelected = new EventEmitter<GMapAddress>();
  @Input() addrType: String;
  @Input() selectedLat: number;
  @Input() selectedLon: number;

  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {
  }

  ngOnInit() {
    //set google maps defaults
    this.zoom = zoomDefault;
    this.latitude = 32.52496990665209;
    this.longitude = -116.99894662938277;
    this.markerLat = this.latitude;
    this.markerLong = this.longitude;
    //create search FormControl
    this.searchControl = new FormControl();


    //set current position
    this.setCurrentPosition();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        bounds: {east: -117.127747, north: 32.556383, south: 32.321788, west: -116.776543},
        strictBounds: true,
        componentRestrictions: {country: 'mx'}
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.markerLat = this.latitude;
          this.markerLong = this.longitude;
          this.zoom = zoomDefault;
        });
      });
    });

    const geocodeLatLngObs = Observable.create(observer => {

    });
  }

  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = zoomDefault;
      });
    }
  }

  mapClicked($event) {
    console.log($event.coords.lat);
    console.log($event.coords.lng);
    this.markerLat = $event.coords.lat;
    this.markerLong = $event.coords.lng;
    this.zoom = zoomDefault;
  }

  // REVERSE GEOCODING TO ADDRESS
  geocodeLatLng() {
    this.geocodeLatLngObs().subscribe(
      (data: string) => {
        const gmapAddr = new GMapAddress();
        gmapAddr.formattedAddr = data;
        gmapAddr.lat = this.markerLat;
        gmapAddr.lon = this.markerLong;
        this.addressSelected.emit(gmapAddr);
      },
      (error: string) => {
        window.alert(error);
      },
      () => {
        console.log('geocodeLatLngObs completed!');
      }
    );
  }

  geocodeLatLngObs(): Observable<string> {
    const latlng = {lat: this.markerLat, lng: this.markerLong};

    return Observable.create((observer: Observer<string>) => {
      this.geocoder.geocode({'location': latlng}, function (results, status) {
        if (status.toString() === 'OK') {
          if (results[0]) {
            const address = results[0].formatted_address;
            observer.next(address);
          } else {
            observer.error('No results found');
            //window.alert('No results found');
          }
        } else {
          observer.error('Geocoder failed due to: ' + status);
          //window.alert('Geocoder failed due to: ' + status);
        }
      });
    });
  }

}
