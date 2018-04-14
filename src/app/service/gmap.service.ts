import {Injectable} from '@angular/core';
import {GMapAddress} from '../shared/model/gmap-address.model';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import Distance = google.maps.Distance;

@Injectable()
export class GmapService {

  constructor() { }

  calculateDistanceObs (origin: GMapAddress, destination: GMapAddress): Observable<Distance> {
    const originLatLong = new google.maps.LatLng(origin.lat, origin.lon);
    const destLatLong = new google.maps.LatLng(destination.lat, destination.lon);

    const service = new google.maps.DistanceMatrixService();

    return Observable.create( (observer: Observer<Distance>) => {
      service.getDistanceMatrix(
        {
          origins: [originLatLong],
          destinations: [destLatLong],
          travelMode: google.maps.TravelMode.DRIVING,
          drivingOptions: {
            departureTime: new Date(Date.now()),
            trafficModel: google.maps.TrafficModel.OPTIMISTIC
          }
        }, function(response, status) {
          if (status.toString() === 'OK') {
            const origins = response.originAddresses;
            const destinations = response.destinationAddresses;

            const distance = response.rows[0].elements[0].distance;
            console.log('distance:' + distance.text);
            observer.next(distance);

          } else {
            observer.error('Distance Matrix failed due to ' + status);
          }
        });
    });



  }

}
