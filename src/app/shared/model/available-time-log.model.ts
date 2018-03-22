import {ScheduledItemLog} from './scheduled-items.model';

export class AvailTimeLog {
    dateStr: string;
    busyHours: Array<ScheduledItemLog>;

    constructor(dateStr: string, idTime: string, itemId: string) {
      this.dateStr = dateStr;
      this.busyHours = [];
      this.busyHours.push(new ScheduledItemLog(idTime, itemId));
    }
}
