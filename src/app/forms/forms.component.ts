import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ServiceItem } from "../shared/model/service-item.model";
import { Destination } from "../shared/model/destination.model";



@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class FormsComponent implements OnInit {
  public serviceItem: ServiceItem;
  public destinationArray: Array<Destination>;


  constructor(public router: Router) {
    this.serviceItem = new ServiceItem();
    this.serviceItem.destinations.push(new Destination());
  }

  ngOnInit() {
  }

  addDeliveryService() {
    console.log("This is my service:", this.serviceItem);
  }


}
