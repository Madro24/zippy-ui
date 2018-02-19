import { LogData } from "./log-data.model";
import { Customer } from "./customer.model";

export class Destination{
  distance: number;
  instructions: string;
  location: string;
  logs: Array<LogData>;
  message: string;
  packageContent: string;
  receiver: Customer;
  sequence: number;

  constructor () {
    this.logs = [];
    this.receiver = new Customer();
  }
}
