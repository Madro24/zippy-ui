import { Customer } from "./customer.model";
import { Destination } from "./destination.model";
import { PriceLog } from "./price-log.model";
import { TimeModel } from "./time.model";
import { ServiceTypeEnum, PayByEnum, ServiceStatusEnum } from "../enum/global-enums";
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {GMapAddress} from './gmap-address.model';

export class ServiceItem {
  itemId: string;
  date: string;
  type: string;
  payBy: string;
  sender: Customer;
  originLocation: string;
  originLocationGmap: GMapAddress;
  itemStatus: string;
  deliveryGuy: string;
  destinations: Array<Destination>;
  usedFares: PriceLog;
  totalCost: string;
  recolectDate: NgbDateStruct;
  recolectTimeIndex: string;
  recolectTimeHour: string;
  constructor() {
    this.type = ServiceTypeEnum[ServiceTypeEnum.EXPRESS];
    this.sender = new Customer();
    this.usedFares = new PriceLog();
    this.destinations = [];
  }

  static compare(item1: ServiceItem, item2: ServiceItem): number {
    if (item1.itemStatus === 'ACTIVO' && item2.itemStatus !== 'ACTIVO') {
      return -1;
    } else if (item1.itemStatus !== 'ACTIVO' && item2.itemStatus === 'ACTIVO') {
      return 1;
    }
    if (item1.date < item2.date) {
      return 1;
    } else if (item1.date > item2.date) {
      return -1;
    } else {
      return 0;
    }
  }
}
