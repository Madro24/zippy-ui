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

  getServiceItemById (itemId: string) : Promise<ServiceItem> {
    return new Promise<ServiceItem> (
      (resolve, reject) => {
          if (this.serviceItemArray.length == 0) {
            this.serviceItemDDB.getServiceAllItems(this.serviceItemArray, <ServiceItemCallback> {
              callback() {
                console.log("getting data from getServiceItemById");
                let serviceItem: ServiceItem = this.serviceItemArray.find(x => x.itemId === itemId);

                if(serviceItem != null) {
                  resolve(serviceItem);
                }
                else {
                  reject(new Error("Item not found!"));
                }
              },
              callbackWithParam(result: any) {
                console.log("getting data from callbackWithParam")
              }
            }
          );

          }
      }
    );
  }

  pushItem(item: ServiceItem, callback: ServiceItemCallback) {
    this.serviceItemDDB.writeServiceItem(item, callback);
    this.serviceItemArray.push(item);
  }

  updateItem(item: ServiceItem, itemId: string, callback: ServiceItemCallback) {
    console.log("Update ServiceItem, itemId:"+ itemId+ ". Item:" +item);
    this.serviceItemDDB.writeServiceItem(item, callback);

    let index = this.serviceItemArray.findIndex(x => x.itemId == itemId);
    this.serviceItemArray[index] = item;
  }

}
