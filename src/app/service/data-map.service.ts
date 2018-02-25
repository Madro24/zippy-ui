import { Injectable } from '@angular/core';
import { ServiceItemDDBService, ServiceItemCallback } from "../service/ddbServiceItems.service"
import { ServiceItem } from "../shared/model/service-item.model";
import { Observable } from 'rxjs/Rx';

@Injectable()
export class DataMapService {
  private serviceItemArray: Array<ServiceItem>;
  constructor(private serviceItemDDB: ServiceItemDDBService) {
    this.serviceItemArray = [];
  }

  getItems( callback: ServiceItemCallback): Observable<Array<ServiceItem>>  {
    if (this.serviceItemArray.length == 0) {
      this.serviceItemDDB.getServiceAllItems(this.serviceItemArray,  callback);
    }
    return Observable.of(this.serviceItemArray);
  }

  getServiceItemByIndex(index: number) {
    return this.serviceItemArray[index];
  }

  pushItem(item: ServiceItem, callback: ServiceItemCallback) {
    this.serviceItemDDB.writeServiceItem(item, callback);
    this.serviceItemArray.push(item);
  }

  updateItem(item: ServiceItem, index: number, callback: ServiceItemCallback) {
    console.log("Update ServiceItem, index:"+ index+". Item:" +item);
    this.serviceItemDDB.writeServiceItem(item, callback);
    this.serviceItemArray[index] = item;
  }
}
