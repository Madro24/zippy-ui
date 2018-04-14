import { LogData } from './log-data.model';
import { Customer } from './customer.model';
import {GMapAddress} from './gmap-address.model';

export class Destination{
  distance: number;
  instructions: string;
  location: string;
  locationGmap: GMapAddress;
  logs: Array<LogData>;
  message: string;
  packageContent: string;
  receiver: Customer;
  sequence: number;
  urlMap: string;

  constructor () {
    this.logs = [];
    this.receiver = new Customer();
  }
}
