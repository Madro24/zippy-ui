import { Component, OnInit, Input } from '@angular/core';
import { ServiceTypeEnum } from "../../shared/enum/global-enums";
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { ServiceItem } from "../../shared/model/service-item.model";
import { Destination } from "../../shared/model/destination.model";
import { DataMapService } from "../../service/data-map.service"
const now = new Date();

@Component({
  selector: 'app-senderform',
  templateUrl: './senderform.component.html',
  styleUrls: ['./senderform.component.css']
})
export class SenderformComponent implements OnInit {
  public serviceItem: ServiceItem;
  public destinationArray: Array<Destination>;

  // model: NgbDateStruct;
  // date: {year: number, month: number};
  // time = { hour: 8, minute: 0 };

  constructor(public dataMapService:DataMapService) {
    this.serviceItem = new ServiceItem();
    this.serviceItem.date = String(now.getFullYear()) + String(now.getMonth()+1) + String(now.getDate()) ;
    this.serviceItem.destinations.push(new Destination());
  //  this.model = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
  }

  ngOnInit() {
  }


  getServiceTypes() : Array<string> {
        var keys = Object.keys(ServiceTypeEnum);
        return keys.slice(keys.length / 2);
    }

    addDeliveryService() {
      console.log("This is my service:", this.serviceItem);

      var itemId = this.serviceItem.date + this.serviceItem.timePicker.hour + this.serviceItem.timePicker.minute + "E1"

      var recolectDate = this.serviceItem.datePicker.year + "-" +this.serviceItem.datePicker.month + "-" + this.serviceItem.datePicker.day;

      var recolectTime = this.serviceItem.timePicker.hour+ ":"+this.serviceItem.timePicker.minute;

      this.serviceItem.itemId = itemId;
      this.serviceItem.usedFares.distanceFare = "9";
      this.serviceItem.usedFares.timeFare = "2.25";
      this.serviceItem.recolectTime=recolectTime;
      this.serviceItem.recolectDate=recolectDate;
      this.serviceItem.destinations[0].sequence = "1";
      this.serviceItem.itemStatus = "CREATED";
      this.serviceItem.totalCost = "50";

      this.dataMapService.pushItem(this.serviceItem);
    }

}
