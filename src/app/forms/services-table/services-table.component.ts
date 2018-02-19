import { Component, OnInit, Input } from '@angular/core';
import { DataMapService } from "../../service/data-map.service";
import { ServiceItem } from "../../shared/model/service-item.model";
import { ServiceStatusEnum } from "../../shared/enum/global-enums";

@Component({
  selector: 'app-services-table',
  templateUrl: './services-table.component.html',
  styleUrls: ['./services-table.component.css']
})
export class ServicesTableComponent implements OnInit {
  _serviceItemArray: Array<ServiceItem>;

  constructor(private dataMapService: DataMapService) {

  }

  getServiceItems(): void {
    this.dataMapService.getItems()
      .subscribe(
      resultArray => this._serviceItemArray = resultArray,
      error => console.log("Error getting service items array. " + error)
      );
  }

  ngOnInit() {
    this.getServiceItems();
  }

}
