import { Injectable } from '@angular/core';
import {AvailableTimeDDBserviceService} from './dynamodb-services/available-time-ddbservice.service';
import {AvailTimeLog} from '../shared/model/available-time-log.model';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {CommonUtilService} from './common-util.service';

const START_AVAIL_TIME = '08:20';
const LAST_AVAIL_TIME = '14:00';
const INCR_AVAIL_TIME = 20;

@Injectable()
export class DataAvailabilityMapService {
  private mapArray: Array<AvailTimeLog>;
  private workdayArray: Array<WorkdayHour>;

  constructor(private availabilityDDBService: AvailableTimeDDBserviceService, private commonUtils: CommonUtilService) {

  }

  init(): void {
    this.initAvailArray(this.mapArray);
    this.workdayArray = [];
    this.initWorkdayArray(START_AVAIL_TIME, LAST_AVAIL_TIME, this.workdayArray);
  }

  initAvailArray(mapArray: Array<AvailTimeLog>) {
    mapArray = [];
    this.availabilityDDBService.getAllItems(mapArray);
  }

  // loadAvailabilityArray(): Observable<Array<AvailTimeLog>> {
  //   return Observable.create((observer: Observer) => {
  //     if (this.mapArray.length === 0) {
  //       this.availabilityDDBService.getAllItems(this.mapArray);
  //     }
  //     observer.next(this.mapArray);
  //   });
  // }

  getAvailabilityArray(): Array<AvailTimeLog> {
    return this.mapArray;
  }

  getByDate(dateId: string): AvailTimeLog {
    return this.mapArray.find(x => x.dateStr === dateId);
  }

  getWorkDayArray (): Array<WorkdayHour> {
    return this.workdayArray;
  }

  initWorkdayArray(start: string, end: string, workdayArray: Array<WorkdayHour>) {
    let time = start;
    let index = 0;

    do {
      workdayArray.push(new WorkdayHour(index, time));
      time = this.nextWorkday(time, INCR_AVAIL_TIME);
      index++;
    } while (end !== time);

    workdayArray.push(new WorkdayHour(index, time));
  }



  nextWorkday(currentTime: string, increaseBy: number): string {
    const splitTime = currentTime.split(':');

    let sumHour = parseInt(splitTime[0], 10);
    let sumMinutes = parseInt(splitTime[1], 10) + increaseBy;

    sumHour = sumHour + Math.floor(sumMinutes / 60);
    sumMinutes = sumMinutes % 60;

    return this.commonUtils.twoDigitsFormat(sumHour) + ':' + this.commonUtils.twoDigitsFormat(sumMinutes);
  }

}




export class WorkdayHour {
  private id: number;
  private hour: string;
  private enabled: boolean;

  constructor (id: number, hour: string) {
    this.id = id;
    this.hour = hour;
    this.enabled = true;
  }

}
