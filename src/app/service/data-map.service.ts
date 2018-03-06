import { Injectable } from '@angular/core';
import { ServiceItemDDBService, ServiceItemCallback } from '../service/ddbServiceItems.service';
import { ServiceItem } from '../shared/model/service-item.model';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class DataMapService {
  public serviceItemArray: Array<ServiceItem>;
  constructor(private serviceItemDDB: ServiceItemDDBService) {
    this.serviceItemArray = [];
  }

  getItems( callback: ServiceItemCallback): Observable<Array<ServiceItem>>  {
    if (this.serviceItemArray.length === 0) {
      this.serviceItemDDB.getActiveItems(this.serviceItemArray,  callback);
    }
    return Observable.of(this.serviceItemArray);
  }

  getServiceItemByIndex(index: number) {
    return this.serviceItemArray[index];
  }

  getServiceItemById (itemId: string, callback: ServiceItemCallback): Observable<ServiceItem> {
    if (this.serviceItemArray.length === 0) {
      this.serviceItemDDB.getActiveItems(this.serviceItemArray,  callback);
    }

    const findItem = this.serviceItemArray.find(x => x.itemId === itemId);
    return Observable.of(findItem);

  }

  pushItem(item: ServiceItem, callback: ServiceItemCallback) {
    this.serviceItemDDB.writeServiceItem(item, callback);
    this.serviceItemArray.push(item);
    this.serviceItemArray.sort((item1, item2) => ServiceItem.compare(item1, item2));
  }

  updateItem(item: ServiceItem, itemId: string, callback: ServiceItemCallback) {
    console.log('Update ServiceItem, itemId:' + itemId + '. Item:' + item);
    this.serviceItemDDB.writeServiceItem(item, callback);

    const index = this.serviceItemArray.findIndex(x => x.itemId === itemId);
    this.serviceItemArray[index] = item;
  }



}
