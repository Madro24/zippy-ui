import { Component, OnInit } from '@angular/core';
import { ServiceItemDDBService } from "../../service/ddbServiceItems.service"
import { ServiceItem } from "../../shared/model/service-item.model";
@Component({
  selector: 'app-services-table',
  templateUrl: './services-table.component.html',
  styleUrls: ['./services-table.component.css']
})
export class ServicesTableComponent implements OnInit {
  mapArray: Array<ServiceItem>;
  constructor(public serviceItemDDB: ServiceItemDDBService) { }

  ngOnInit() {
    this.mapArray = [];
    this.serviceItemDDB.getServiceAllItems(this.mapArray);
  }

}
