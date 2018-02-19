import { Injectable } from '@angular/core';
import { ServiceItemDDBService } from "../service/ddbServiceItems.service"
import { ServiceItem } from "../shared/model/service-item.model";
import { Observable } from 'rxjs/Rx'

@Injectable()
export class DataMapService {
  private serviceItemArray: Array<ServiceItem>;
  constructor(private serviceItemDDB: ServiceItemDDBService) {
    this.serviceItemArray = [];
  }

  getItems(): Observable<Array<ServiceItem>>  {
    if (this.serviceItemArray.length == 0) {
      this.serviceItemDDB.getServiceAllItems(this.serviceItemArray);
    }
    return Observable.of(this.serviceItemArray);
  }

  getServiceItemByIndex(index: number) {
    return this.serviceItemArray[index];
  }

  pushItem(item: ServiceItem) {
    this.serviceItemDDB.writeServiceItem(item);
    this.serviceItemArray.push(item);
  }

  updateItem(item: ServiceItem, index: number) {
    console.log("Update ServiceItem, index:"+ index+". Item:" +item);
    this.serviceItemDDB.writeServiceItem(item);
    this.serviceItemArray[index] = item;
  }
}
