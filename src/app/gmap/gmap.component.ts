
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';


const zoomDefault: number = 21;

@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.css']
})
export class GmapComponent implements OnInit {
  public latitude: number;
    public longitude: number;
    public searchControl: FormControl;
    public zoom: number;
    public markLat: number;
    public markLong: number
    public geocoder: google.maps.Geocoder;
    

    @ViewChild("search")
    public searchElementRef: ElementRef;

    constructor(
      private mapsAPILoader: MapsAPILoader,
      private ngZone: NgZone
    ) {}

    ngOnInit() {
      //set google maps defaults
      this.zoom = zoomDefault;
      this.latitude = 32.52496990665209;
      this.longitude = -116.99894662938277;
      this.markLat = this.latitude;
      this.markLong = this.longitude;
      //create search FormControl
      this.searchControl = new FormControl();
      

      //set current position
      this.setCurrentPosition();

      //load Places Autocomplete
      this.mapsAPILoader.load().then(() => {
        this.geocoder = new google.maps.Geocoder();
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
          bounds: {east:-117.127747,north:32.556383, south:32.321788, west:-116.776543},
          strictBounds: true,
          componentRestrictions: {country:"mx"}
        });
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            //get the place result
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();

            //verify result
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }

            //set latitude, longitude and zoom
            this.latitude = place.geometry.location.lat();
            this.longitude = place.geometry.location.lng();
            this.markLat = this.latitude;
            this.markLong = this.longitude;
            this.zoom = zoomDefault;
          });
        });
      });
    }

    private setCurrentPosition() {
      if ("geolocation" in navigator) {
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
      this.markLat = $event.coords.lat;
      this.markLong = $event.coords.lng;
      this.zoom = zoomDefault;
    }

    // REVERSE GEOCODING TO ADDRESS
    geocodeLatLng(){
      this.geocoder = new google.maps.Geocoder();
      const latlng = {lat: this.markLat, lng: this.markLong};
      this.geocoder.geocode({'location': latlng}, function(results, status) {
          console.log('Reverse Geocode:'+ JSON.stringify(results));
          console.log('Status:'+ JSON.stringify(status));
          if (status.toString() === 'OK') {
            if (results[0]) {
              console.log("Selected address:" + results[0].formatted_address);
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
    
      });
    }
  }
