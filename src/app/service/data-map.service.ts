import { Injectable } from '@angular/core';
import { ServiceItemDDBService } from './dynamodb-services/ddbServiceItems.service';
import { ServiceItem } from '../shared/model/service-item.model';
import { Observable } from 'rxjs/Rx';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class DataMapService {
  public serviceItemArray: Array<ServiceItem>;
  constructor(private serviceItemDDB: ServiceItemDDBService) {
    this.serviceItemArray = [];
  }

  getItems(): Observable<Array<ServiceItem>>  {
    if (this.serviceItemArray.length === 0) {
      return this.serviceItemDDB.getActiveItemsObs();
    }
    return Observable.of(this.serviceItemArray);
  }

  getServiceItemByIndex(index: number) {
    return this.serviceItemArray[index];
  }

  getServiceItemById (itemId: string): Observable<ServiceItem> {
    console.log('getServiceItemById, ItemId:' + itemId);
    return Observable.create( (observer: Observer<ServiceItem>) => {
      if (this.serviceItemArray.length === 0) {
        this.serviceItemDDB.getActiveItemsObs().subscribe(
          (data: Array<ServiceItem>) => {
            this.serviceItemArray = data;
            const findItem = this.serviceItemArray.find(x => x.itemId === itemId);
            observer.next(findItem);
            observer.complete();
          },
          (error: string) => {
            observer.error(error);
          }
        );
      } else {
        const findItem = this.serviceItemArray.find(x => x.itemId === itemId);
        observer.next(findItem);
        observer.complete();
      }
    });
  }

  itemInsertSuccess(item: ServiceItem): void {
    this.serviceItemArray.push(item);
    this.serviceItemArray.sort((item1, item2) => ServiceItem.compare(item1, item2));
  }

  itemUpdateSuccess(item: ServiceItem): void {
    const index = this.serviceItemArray.findIndex(x => x.itemId === item.itemId);
    this.serviceItemArray[index] = item;
    this.serviceItemArray.sort((item1, item2) => ServiceItem.compare(item1, item2));
  }

  pushItem(item: ServiceItem): Observable<ServiceItem> {
    console.log('Add ServiceItem, Item:' + item);
    return Observable.create( (observer: Observer<ServiceItem>) => {
      this.serviceItemDDB.writeItemObs(item).subscribe(
        (data: boolean) => {
          observer.next(item);
          observer.complete();
        },
        (error: string) => {
          observer.error(error);
        }
      );
    }); 
  }

  updateItem(item: ServiceItem, itemId: string) {
    console.log('Update ServiceItem, itemId:' + itemId + '. Item:' + item);
    return Observable.create( (observer: Observer<ServiceItem>) => {
      this.serviceItemDDB.writeItemObs(item).subscribe(
        (data: boolean) => {
          observer.next(item);
          observer.complete();
        },
        (error: string) => {
          observer.error(error);
        }
      );
    }); 
  }

}
