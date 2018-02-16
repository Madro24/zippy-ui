import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ServiceItem } from "../shared/model/service-item.model";
import { Destination } from "../shared/model/destination.model";
import { ServiceItemDDBService } from "../service/ddbServiceItems.service"

const now = new Date();

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class FormsComponent implements OnInit {
  public serviceItem: ServiceItem;
  public destinationArray: Array<Destination>;


  constructor(public router: Router, public serviceItemDDB: ServiceItemDDBService) {
    this.serviceItem = new ServiceItem();
    this.serviceItem.date = now.getFullYear() + now.getMonth() + 1 + now.getDate();
    this.serviceItem.destinations.push(new Destination());
  }

  ngOnInit() {
  }

  addDeliveryService() {
    console.log("This is my service:", this.serviceItem);

    var itemId = this.serviceItem.date + this.serviceItem.timePicker.hour + this.serviceItem.timePicker.minute + "E1"

    var recolectDate = this.serviceItem.datePicker.year + "-" this.serviceItem.datePicker.month + "-" this.serviceItem.datePicker.day;

    var recolectTime = this.serviceItem.timePicker.hour+ ":"+this.serviceItem.timePicker.minute;



    this.serviceItem.id = "1";
    this.serviceItem.usedFares.distanceFare = "9";
    this.serviceItem.usedFares.timeFare = "2.25";
    this.serviceItem.recolectTime=recolectTime;
    this.serviceItem.recolectDate=recolectDate;
    this.serviceItem.destinations[0].sequence = "1";
    this.serviceItem.status = "CREATED";
    this.serviceItem.totalCost = "50";
    this.serviceItemDDB.writeServiceItem(this.serviceItem);
  }


}
