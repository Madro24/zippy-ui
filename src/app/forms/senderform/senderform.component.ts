import {Component, OnInit, ViewChild} from '@angular/core';
import {ServiceTypeEnum, ServiceStatusEnum, PayByEnum} from '../../shared/enum/global-enums';
import {ServiceItem} from '../../shared/model/service-item.model';
import {Destination} from '../../shared/model/destination.model';
import {DataMapService} from '../../service/data-map.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ServiceItemCallback} from '../../service/ddbServiceItems.service';
import {CommonUtilService} from '../../service/common-util.service';
import { NgForm } from '@angular/forms';

const now = new Date();
const defaultItemStatus = 'ACTIVO';
const defaultServType = 'EXPRESS';
const defaultPayBy = 'REMITENTE';
const defaultDay = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
const defaultTime = { hour: now.getHours(), minute: 0 };
const distanceFare = 8.90;
const timeFare = 2.25;
@Component({
  selector: 'app-senderform',
  templateUrl: './senderform.component.html',
  styleUrls: ['./senderform.component.css']
})
export class SenderformComponent implements OnInit, ServiceItemCallback {
  @ViewChild('itemRegForm') itemRegForm: NgForm;
  public serviceItem: ServiceItem;
  public destinationArray: Array<Destination>;

  private itemId: string;
  isEditAction = false;
  wasSaveClicked = false;
  enableUrlMapField = false;
  submitted = false;

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
      this.enableUrlMapField = false;
      this.isEditAction = false;
      this.newServiceItem();
    }


  }

  newServiceItem() {
    this.serviceItem = new ServiceItem();
    this.serviceItem.date = now.toISOString();
    this.serviceItem.recolectDate = defaultDay;
    this.serviceItem.recolectTime = defaultTime;
    this.serviceItem.itemStatus = defaultItemStatus;
    this.serviceItem.payBy = defaultPayBy;

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
    this.wasSaveClicked = false;
    this.router.navigate(['/serviceItemList']);
  }

  callbackWithParam(result: any) {
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

  enableUrlMap() {
    this.enableUrlMapField = true;
  }

  getSearchMapURI(location: string): string {
    return encodeURI('https://www.google.com/maps/search/' +  location);
  }

  onSubmit() {
    console.log(this.itemRegForm);
    this.wasSaveClicked = true;

    this.mapFormToObj();
    if (!this.isEditAction) {
      const formattedDate =
        this.serviceItem.recolectDate.year
        + this.commonUtils.twoDigitsFormat(this.serviceItem.recolectDate.month)
        + this.commonUtils.twoDigitsFormat(this.serviceItem.recolectDate.day);
      const formattedTime =
        this.commonUtils.twoDigitsFormat(this.serviceItem.recolectTime.hour)
        + this.commonUtils.twoDigitsFormat(this.serviceItem.recolectTime.minute);

      this.serviceItem.itemId = formattedDate + formattedTime + this.serviceItem.type.charAt(0) + '1';
    }
    this.serviceItem.usedFares.distanceFare = distanceFare.toString();
    this.serviceItem.usedFares.timeFare = timeFare.toString();
    this.serviceItem.totalCost = this.getTotalCost(this.serviceItem.destinations[0].distance);

    this.setServiceItemToUpperCase(this.serviceItem);
    console.log(this.serviceItem);

    if (this.isEditAction) {
      this.dataMapService.updateItem(this.serviceItem, this.itemId, this);
    } else {
      this.dataMapService.pushItem(this.serviceItem, this);
    }

    this.itemRegForm.reset();

  }

  mapFormToObj() {
    if ( this.itemRegForm.value.itemStatus != null) {
      this.serviceItem.itemStatus = this.itemRegForm.value.itemStatus;
    } else {
      this.serviceItem.itemStatus = defaultItemStatus;
    }
    this.serviceItem.type = this.itemRegForm.value.itemType;
    this.serviceItem.recolectDate = this.itemRegForm.value.dp;
    this.serviceItem.recolectTime = this.itemRegForm.value.serviceTime;
    this.serviceItem.sender.name = this.itemRegForm.value.senderName;
    this.serviceItem.sender.phone = this.itemRegForm.value.senderPhone;
    this.serviceItem.originLocation = this.itemRegForm.value.originLocation;
    this.serviceItem.payBy = this.itemRegForm.value.payBy;

    this.serviceItem.destinations[0].location = this.itemRegForm.value.destLocation;
    this.serviceItem.destinations[0].urlMap = this.itemRegForm.value.destUrlMap;
    this.serviceItem.destinations[0].receiver.name = this.itemRegForm.value.destRecName;
    this.serviceItem.destinations[0].packageContent = this.itemRegForm.value.destPkgContent;
    this.serviceItem.destinations[0].message = this.itemRegForm.value.destMsg;
    this.serviceItem.destinations[0].instructions = this.itemRegForm.value.destInst;
    this.serviceItem.destinations[0].distance = this.itemRegForm.value.destDistance;
  }
  getTotalCost(value) {
    return (+value * distanceFare).toFixed(2);
  }

}
