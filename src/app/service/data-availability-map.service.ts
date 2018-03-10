import { Injectable } from '@angular/core';
import {AvailableTimeDDBserviceService} from './dynamodb-services/available-time-ddbservice.service';
import {AvailTimeLog} from '../shared/model/available-time-log.model';
import {IDDBcallback} from './dynamodb-services/iddbcallback';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';

@Injectable()
export class DataAvailabilityMapService {
  private mapArray: Array<AvailTimeLog>;

  constructor(private availabilityDDBService: AvailableTimeDDBserviceService) {
    this.mapArray = [];
  }

  getAvailabilityArray(): Observable<Array<AvailTimeLog>> {
    return Observable.create((observer: Observer) => {
      if (this.mapArray.length === 0) {
        this.availabilityDDBService.getAllItems(this.mapArray);
      }
      observer.next(this.mapArray);
    });
  }


  getTableItems() {
    if (this.mapArray.length === 0) {
      this.availabilityDDBService.getAllItems().subscribe(
        (data: Array<AvailTimeLog>) => {
          this.mapArray = data;
        },
        (error: string) => {
          this.mapArray = [];
        }
      );
    }

  }

}
