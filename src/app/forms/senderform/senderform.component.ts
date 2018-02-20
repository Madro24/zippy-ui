import { Component, OnInit, Input } from '@angular/core';
import { ServiceTypeEnum, ServiceStatusEnum, PayByEnum } from "../../shared/enum/global-enums";
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ServiceItem } from "../../shared/model/service-item.model";
import { Destination } from "../../shared/model/destination.model";
import { DataMapService } from "../../service/data-map.service"
import { Router, ActivatedRoute } from "@angular/router";

const now = new Date();

@Component({
  selector: 'app-senderform',
  templateUrl: './senderform.component.html',
  styleUrls: ['./senderform.component.css']
})
export class SenderformComponent implements OnInit {
  public serviceItem: ServiceItem;
  public destinationArray: Array<Destination>;

  private itemIndex: number;
  public isEditAction = false;
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

    this.serviceItem.totalCost = (this.serviceItem.destinations[0].distance * 8.90).toFixed(2);
  }

  newServiceItem() {
    this.serviceItem = new ServiceItem();
    this.serviceItem.itemStatus = ServiceStatusEnum[ServiceStatusEnum.CREATED];
    this.serviceItem.payBy = PayByEnum[PayByEnum.Origin];
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

  addDeliveryService() {
    console.log("This is my service:", this.serviceItem);

    if (!this.isEditAction) {
      var itemId = this.serviceItem.date + this.serviceItem.recolectTime.hour + this.serviceItem.recolectTime.minute + "E1";
      this.serviceItem.itemId = itemId;
    }

    this.serviceItem.usedFares.distanceFare = "9";
    this.serviceItem.usedFares.timeFare = "2.25";
    this.serviceItem.totalCost = "50";

    if (this.isEditAction) {
      this.dataMapService.updateItem(this.serviceItem,this.itemIndex);
    }
    else {
      this.dataMapService.pushItem(this.serviceItem);
    }

    this.router.navigate(['/serviceItemList']);
  }

}
