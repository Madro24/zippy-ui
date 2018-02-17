import { Component, OnInit, Input } from '@angular/core';
import { ServiceItemDDBService } from "../../service/ddbServiceItems.service"
import { ServiceItem } from "../../shared/model/service-item.model";
@Component({
  selector: 'app-services-table',
  templateUrl: './services-table.component.html',
  styleUrls: ['./services-table.component.css']
})
export class ServicesTableComponent implements OnInit {
  @Input() mapArray: Array<ServiceItem>;
  constructor(public serviceItemDDB: ServiceItemDDBService) {

  }

  ngOnInit() {
  }

}
