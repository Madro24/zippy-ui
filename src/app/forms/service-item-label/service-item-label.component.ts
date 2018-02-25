import { Component, OnInit } from '@angular/core';
import { DataMapService } from "../../service/data-map.service";
import { Router, ActivatedRoute } from "@angular/router";
import { ServiceItem } from "../../shared/model/service-item.model";
import { Customer } from "../../shared/model/customer.model";
import { Destination } from "../../shared/model/destination.model";

@Component({
  selector: 'app-service-item-label',
  templateUrl: './service-item-label.component.html',
  styleUrls: ['./service-item-label.component.css']
})
export class ServiceItemLabelComponent implements OnInit {
  public serviceItem: ServiceItem;
  private itemIndex: number;

  constructor(private router: Router, private actRoute: ActivatedRoute, public dataMapService: DataMapService) { }

  ngOnInit() {
    console.log("service item label init");
    this.itemIndex = this.actRoute.snapshot.params['index'];
    console.log("index:" + this.itemIndex);
    if (this.itemIndex != null) {

      // this.serviceItem = this.dataMapService.getServiceItemByIndex(this.itemIndex);
      this.serviceItem = new ServiceItem();
      this.serviceItem.payBy = "Remitente";
      this.serviceItem.itemId = "201822050E1";
      this.serviceItem.originLocation = "Torre Cosmopolitan";
      this.serviceItem.sender = new Customer();
      this.serviceItem.sender.name = "Omar Madrid";
      this.serviceItem.sender.phone = "6646405540";
      this.serviceItem.destinations = [];
      this.serviceItem.destinations[0] = new Destination();
      this.serviceItem.destinations[0].receiver = new Customer();
      this.serviceItem.destinations[0].receiver.name = "Laura Ruiz";
      this.serviceItem.destinations[0].packageContent = "Regalo";
      this.serviceItem.destinations[0].message = "Guardalo bien";
      this.serviceItem.destinations[0].instructions = "Dejarlo en recepcion";
      console.log("this.serviceItem:" + this.serviceItem.itemId);

    }
    else {
      this.router.navigate(['/serviceItemList']);
    }
  }

}
