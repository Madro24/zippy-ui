import { Customer } from "./customer.model";
import { Destination } from "./destination.model";
import { PriceLog } from "./price-log.model";
import { ServiceTypeEnum, PayByEnum, ServiceStatusEnum } from "../enum/global-enums";

export class ServiceItem {
  id: string;
  date: string;
  type: string;
  payBy: string;
  sender: Customer;
  originLocation: string;
  status: string;
  deliveryGuy: string;
  destinations: Array<Destination>;
  usedFares: PriceLog;
  totalCost: string;
  recolectTime: string;

  constructor() {
    this.type = ServiceTypeEnum[ServiceTypeEnum.Express];
    this.sender = new Customer();
    this.usedFares = new PriceLog();
    this.destinations = [];
  }
}
