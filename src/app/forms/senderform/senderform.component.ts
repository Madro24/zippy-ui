import { Component, OnInit, Input } from '@angular/core';
import { ServiceTypeEnum, ServiceStatusEnum, PayByEnum } from "../../shared/enum/global-enums";
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ServiceItem } from "../../shared/model/service-item.model";
import { Destination } from "../../shared/model/destination.model";
import { DataMapService } from "../../service/data-map.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ServiceItemCallback } from "../../service/ddbServiceItems.service";

const now = new Date();

@Component({
  selector: 'app-senderform',
  templateUrl: './senderform.component.html',
  styleUrls: ['./senderform.component.css']
})
export class SenderformComponent implements OnInit, ServiceItemCallback {
  public serviceItem: ServiceItem;
  public destinationArray: Array<Destination>;

  private itemIndex: number;
  public isEditAction = false;
  public wasSaveClicked = false;
  // model: NgbDateStruct;
  // date: {year: number, month: number};
  // time = { hour: 8, minute: 0 };

  constructor(private router: Router, private actRoute: ActivatedRoute, public dataMapService: DataMapService) {

    //  this.model = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
  }

  ngOnInit() {
    this.itemIndex = this.actRoute.snapshot.params['index'];
    if (this.itemIndex != null) {
      this.serviceItem = this.dataMapService.getServiceItemByIndex(this.itemIndex);
      this.isEditAction = true;
    }
    else {
      this.newServiceItem();
    }


  }

  newServiceItem() {
    this.serviceItem = new ServiceItem();
    this.serviceItem.itemStatus = ServiceStatusEnum[ServiceStatusEnum.Nuevo];
    this.serviceItem.payBy = PayByEnum[PayByEnum.Remitente];
    this.serviceItem.date = String(now.getFullYear()) + String(now.getMonth() + 1) + String(now.getDate());

    var destinationDefault = new Destination();
    destinationDefault.sequence = 1;
    this.serviceItem.destinations.push(destinationDefault);
  }

  getServiceTypes(): Array<string> {
    var keys = Object.keys(ServiceTypeEnum);
    return keys.slice(keys.length / 2);
  }

  getServiceStatus(): Array<string> {
    var keys = Object.keys(ServiceStatusEnum);
    return keys.slice(keys.length / 2);
  }

  getPayByList(): Array<string> {
    var keys = Object.keys(PayByEnum);
    return keys.slice(keys.length / 2);
  }

  callback() {
    this.router.navigate(['/serviceItemList']);
    this.wasSaveClicked = false;
  }
  callbackWithParam(result: any){}


  addDeliveryService() {
    console.log("This is my service:", this.serviceItem);

    this.wasSaveClicked = true;

    if (!this.isEditAction) {
      var itemId = this.serviceItem.date + this.serviceItem.recolectTime.hour + this.serviceItem.recolectTime.minute + "E1";
      this.serviceItem.itemId = itemId;
    }

    this.serviceItem.totalCost = (this.serviceItem.destinations[0].distance * 8.90).toFixed(2);
    this.serviceItem.usedFares.distanceFare = "9";
    this.serviceItem.usedFares.timeFare = "2.25";
    this.serviceItem.totalCost = "50";

    if (this.isEditAction) {
      this.dataMapService.updateItem(this.serviceItem, this.itemIndex, this);
    }
    else {
      this.dataMapService.pushItem(this.serviceItem, this);
    }


  }

  printLabel() {
    if (this.itemIndex !=null) {
      this.router.navigate(['/service-item-label/',this.itemIndex]);
    }
  }

}
