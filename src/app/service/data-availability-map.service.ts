import { Injectable } from '@angular/core';
import { AvailableTimeDDBserviceService } from './dynamodb-services/available-time-ddbservice.service';
import { AvailTimeLog } from '../shared/model/available-time-log.model';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { CommonUtilService } from './common-util.service';
import { IDDBcallback } from './dynamodb-services/iddbcallback';

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
    this.mapArray = [];
    this.initAvailArray(this.mapArray);
    this.workdayArray = [];
    this.initWorkdayArray(START_AVAIL_TIME, LAST_AVAIL_TIME, this.workdayArray);
  }

  initAvailArray(mapArray: Array<AvailTimeLog>) {
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

  addAvailTimeLog(item: AvailTimeLog) {
    this.availabilityDDBService.writeItem(item);
  }

  updateAvailTimeLog(item: AvailTimeLog) {
    this.availabilityDDBService.updateItem(item);
  }

  getByDate(dateInput: {year, month, day}): AvailTimeLog {
    const dateIn = this.convertDateIntoIdStr(dateInput);
    return this.mapArray.find(x => x.dateStr === dateIn);
  }

  getWorkDayArray(): Array<WorkdayHour> {
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

  getAvailabilityByDate(dateInput: {year, month, day}): Array<WorkdayHour> {
    const dateIn = this.convertDateIntoIdStr(dateInput);

    const timeLogFound = this.mapArray.find(x => x.dateStr === dateIn);

    if (timeLogFound != null) {
      for (let schedLog of timeLogFound.busyHours) {
        if (schedLog.items.length > 1) {
          const indexWorkDay = this.workdayArray.findIndex(x => x.id === +schedLog.id);
          this.workdayArray[indexWorkDay].enabled = false;
        }
      }
    }

    return this.workdayArray;

  }

  convertDateIntoIdStr(dateInput: {year, month, day}): string {
    return dateInput.year
      + this.commonUtils.twoDigitsFormat(dateInput.month)
      + this.commonUtils.twoDigitsFormat(dateInput.day);
  }




}




export class WorkdayHour {
  id: number;
  hour: string;
  enabled: boolean;

  constructor(id: number, hour: string) {
    this.id = id;
    this.hour = hour;
    this.enabled = true;
  }

}
