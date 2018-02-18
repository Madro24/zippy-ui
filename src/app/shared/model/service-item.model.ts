import { Customer } from "./customer.model";
import { Destination } from "./destination.model";
import { PriceLog } from "./price-log.model";
import { ServiceTypeEnum, PayByEnum, ServiceStatusEnum } from "../enum/global-enums";
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

export class ServiceItem {
  itemId: string;
  date: string;
  type: string;
  payBy: string;
  sender: Customer;
  originLocation: string;
  itemStatus: string;
  deliveryGuy: string;
  destinations: Array<Destination>;
  usedFares: PriceLog;
  totalCost: string;
  recolectDate: string;
  recolectTime: string;
  datePicker: NgbDateStruct;
  timePicker: any;
  constructor() {
    this.type = ServiceTypeEnum[ServiceTypeEnum.Express];
    this.sender = new Customer();
    this.usedFares = new PriceLog();
    this.destinations = [];
  }
}
