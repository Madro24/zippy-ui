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

  pushItem(item: ServiceItem) {
    this.serviceItemArray.push(item);
  }
}
