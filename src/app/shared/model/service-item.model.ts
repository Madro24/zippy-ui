import { Customer } from "./customer.model";
import { Destination } from "./destination.model";
import { PriceLog } from "./price-log.model";
import { ServiceTypeEnum, PayByEnum, ServiceStatusEnum } from "../enum/global-enums";

export class ServiceItem {
  id: string;
  date: string;
  type: ServiceTypeEnum;
  payBy: PayByEnum;
  sender: Customer;
  originLocation: string;
  status: ServiceStatusEnum;
  deliveryGuy: string;
  destinations: Array<Destination>;
  usedFares: PriceLog;
  totalCost: number;
}
