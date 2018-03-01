import {Component, OnInit} from '@angular/core';
import {ServiceTypeEnum, ServiceStatusEnum, PayByEnum} from '../../shared/enum/global-enums';
import {ServiceItem} from '../../shared/model/service-item.model';
import {Destination} from '../../shared/model/destination.model';
import {DataMapService} from '../../service/data-map.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ServiceItemCallback} from '../../service/ddbServiceItems.service';
import {CommonUtilService} from '../../service/common-util.service';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

const now = new Date();

@Component({
  selector: 'app-senderform',
  templateUrl: './senderform.component.html',
  styleUrls: ['./senderform.component.css']
})
export class SenderformComponent implements OnInit, ServiceItemCallback {
  public serviceItem: ServiceItem;
  public destinationArray: Array<Destination>;

  private itemId: string;
  public isEditAction = false;
  public wasSaveClicked = false;
  // model: NgbDateStruct;
  // date: {year: number, month: number};
  // time = { hour: 8, minute: 0 };

  constructor(private router: Router,
              private actRoute: ActivatedRoute,
              private dataMapService: DataMapService,
              private commonUtils: CommonUtilService) {

    //  this.model = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
  }

  ngOnInit() {
    this.itemId = this.actRoute.snapshot.params['itemId'];
    if (this.itemId != null) {
      this.dataMapService.getServiceItemById(this.itemId, <ServiceItemCallback> {
        callback: () => {
          this.serviceItem = this.dataMapService.serviceItemArray.find(x => x.itemId === this.itemId);
          console.log('Item ID:' + this.serviceItem.itemId);
        },
        callbackWithParam: (result: any) => {
        }
      })
        .subscribe(
          item => this.serviceItem = item,
          error => {
            console.log('Error getting service items array. ' + error);
            this.router.navigate(['/admin-home']);
          }
        );

      console.log('this.serviceItem:' + this.serviceItem.itemId);
      this.isEditAction = true;
    } else {
      this.newServiceItem();
    }


  }

  newServiceItem() {
    this.serviceItem = new ServiceItem();
    this.serviceItem.type = ServiceTypeEnum[ServiceTypeEnum.EXPRESS];
    this.serviceItem.itemStatus = ServiceStatusEnum[ServiceStatusEnum.ACTIVO];
    this.serviceItem.payBy = PayByEnum[PayByEnum.REMITENTE];
    this.serviceItem.date = String(now.getFullYear()) + String(now.getMonth() + 1) + String(now.getDate());
    const destinationDefault = new Destination();
    destinationDefault.sequence = 1;
    this.serviceItem.destinations.push(destinationDefault);
  }

  getServiceTypes(): Array<string> {
    const keys = Object.keys(ServiceTypeEnum);
    return keys.slice(keys.length / 2);
  }

  getServiceStatus(): Array<string> {
    const keys = Object.keys(ServiceStatusEnum);
    return keys.slice(keys.length / 2);
  }

  getPayByList(): Array<string> {
    const keys = Object.keys(PayByEnum);
    return keys.slice(keys.length / 2);
  }

  callback() {
    this.router.navigate(['/serviceItemList']);
    this.wasSaveClicked = false;
  }

  callbackWithParam(result: any) {
  }


  addDeliveryService() {
    console.log('This is my service:', this.serviceItem);

    this.wasSaveClicked = true;

    if (!this.isEditAction) {
      const formattedDate =
        this.serviceItem.recolectDate.year
        + this.commonUtils.twoDigitsFormat(this.serviceItem.recolectDate.month)
        + this.commonUtils.twoDigitsFormat(this.serviceItem.recolectDate.day);
      const formattedTime =
        this.commonUtils.twoDigitsFormat(this.serviceItem.recolectTime.hour)
        + this.commonUtils.twoDigitsFormat(this.serviceItem.recolectTime.minute);

      this.serviceItem.itemId = formattedDate + formattedTime + this.serviceItem.itemStatus.charAt(0) + '1';
    }

    this.serviceItem.totalCost = (this.serviceItem.destinations[0].distance * 8.90).toFixed(2);
    this.serviceItem.usedFares.distanceFare = '9';
    this.serviceItem.usedFares.timeFare = '2.25';

    this.setServiceItemToUpperCase(this.serviceItem);
    if (this.isEditAction) {
      this.dataMapService.updateItem(this.serviceItem, this.itemId, this);
    } else {
      this.dataMapService.pushItem(this.serviceItem, this);
    }


  }

  setServiceItemToUpperCase(item: ServiceItem) {
    item.sender.name = item.sender.name.toUpperCase();
    item.originLocation = item.originLocation.toUpperCase();
    item.destinations[0].location = item.destinations[0].location.toUpperCase();
    item.destinations[0].packageContent = item.destinations[0].packageContent.toUpperCase();
    item.destinations[0].message = item.destinations[0].message.toUpperCase();
    item.destinations[0].instructions = item.destinations[0].instructions.toUpperCase();
  }

  printLabel() {
    if (this.itemId != null) {
      this.router.navigate(['/service-item-label/', this.itemId]);
    }
  }

}
