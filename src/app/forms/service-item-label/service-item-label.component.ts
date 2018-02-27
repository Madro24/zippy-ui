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

      this.serviceItem = this.dataMapService.getServiceItemByIndex(this.itemIndex);

      console.log("this.serviceItem:" + this.serviceItem.itemId);

    }
    else {
      this.router.navigate(['/serviceItemList']);
    }
  }

  back() {
      this.router.navigate(['/serviceItem/',this.itemIndex]);
  }

}
