import { Injectable } from '@angular/core';
import { ServiceItemDDBService } from "../service/ddbServiceItems.service"

@Injectable()
export class DataMapService {
  private serviceItemArray: Array<ServiceItem>;
  constructor() {
    this.serviceItemArray = [];
      this.serviceItemDDB.getServiceAllItems(this.serviceItemArray);
  }

  getItems(mapArray: Array<ServiceItem>) {
    mapArray = this.serviceItemArray;
  }

  pushItem(item: ServiceItem) {
    this.serviceItemArray.push(item);
  }
}
