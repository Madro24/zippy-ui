import { Injectable } from '@angular/core';
import { AvailableTimeDDBserviceService } from './dynamodb-services/available-time-ddbservice.service';
import { AvailTimeLog } from '../shared/model/available-time-log.model';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { CommonUtilService } from './common-util.service';
import { IDDBcallback } from './dynamodb-services/iddbcallback';
import {ServiceItem} from '../shared/model/service-item.model';
import {ScheduledItemLog} from '../shared/model/scheduled-items.model';

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
    this.mapArray.push(item);
  }

  updateAvailTimeLog(item: AvailTimeLog) {
    this.availabilityDDBService.updateItem(item);
    const index = this.mapArray.findIndex(x => x.dateStr === item.dateStr);
    this.mapArray[index] = item;
  }

  getByDate(dateInput: {year, month, day}): AvailTimeLog {
    const dateIn = this.convertDateIntoIdStr(dateInput);
    return this.mapArray.find(x => x.dateStr === dateIn);
  }

  getWorkDayArray(): Array<WorkdayHour> {
    return this.workdayArray;
  }

  getWorkDayTimeById(index: number): string {
    return this.workdayArray.find(x => x.id === index).hour;
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
    this.resetAvailabilityArray();
    const dateIn = this.convertDateIntoIdStr(dateInput);

    const timeLogFound = this.mapArray.find(x => x.dateStr === dateIn);

    // Disable those hours where more than one item has been allocated
    if (timeLogFound != null) {
      for (const log of timeLogFound.busyHours) {
        if (log.items.length > 1) {
          const indexWorkDay = this.workdayArray.findIndex(x => x.id === +log.id);
          this.workdayArray[indexWorkDay].enabled = false;
        }
      }
    }

    this.disableSingleTimeSlot(this.workdayArray);

    return this.workdayArray;

  }

  // Not possible to allocate one service in one single time slot, it requires two.
  disableSingleTimeSlot(wdArray: Array<WorkdayHour>) {
    for (var _i = 0; _i < wdArray.length - 1; _i++) {
      if (wdArray[_i].enabled && !wdArray[_i+1].enabled) {
        wdArray[_i].enabled = false;
      }
    }
  }

  convertDateIntoIdStr(dateInput: {year, month, day}): string {
    return dateInput.year
      + this.commonUtils.twoDigitsFormat(dateInput.month)
      + this.commonUtils.twoDigitsFormat(dateInput.day);
  }

  createScheduledLogItem(scheduledTimeLog: AvailTimeLog, item: ServiceItem): AvailTimeLog {

    if (scheduledTimeLog == null) {
      scheduledTimeLog = new AvailTimeLog();
      scheduledTimeLog.dateStr = item.recolectDate.year
        + this.commonUtils.twoDigitsFormat(item.recolectDate.month)
        + this.commonUtils.twoDigitsFormat(item.recolectDate.day);

    }

    if (scheduledTimeLog.busyHours == null) {
      scheduledTimeLog.busyHours = new Array<ScheduledItemLog>();
    }

    let timelogIndex = scheduledTimeLog.busyHours.findIndex(x => x.id === item.recolectTimeIndex);
    if (timelogIndex === -1) {
      item.itemId = item.itemId + '1';
    } else {
      item.itemId = item.itemId + '2';
    }


    this.appendBusyHourLog(item.itemId, item.recolectTimeIndex, timelogIndex, scheduledTimeLog.busyHours);
    const nextTimeLog = +item.recolectTimeIndex + 1;
    timelogIndex = scheduledTimeLog.busyHours.findIndex(x => x.id === nextTimeLog.toString());
    this.appendBusyHourLog(item.itemId, nextTimeLog.toString(), timelogIndex, scheduledTimeLog.busyHours);

    return scheduledTimeLog;
  }

  appendBusyHourLog(itemId: string, recolectTime: string, indexTime: number, busyHoursArray: Array<ScheduledItemLog>): void {

    if (busyHoursArray[indexTime] == null) {
      const timeLog = new ScheduledItemLog();
      timeLog.id = recolectTime;
      timeLog.items = new Array<string>();
      timeLog.items.push(itemId);
      busyHoursArray.push(timeLog);
    } else {
      busyHoursArray[indexTime].items.push(itemId);
    }
  }

  resetAvailabilityArray() {
    for (const item of this.workdayArray) {
      item.enabled = true;
    }
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
