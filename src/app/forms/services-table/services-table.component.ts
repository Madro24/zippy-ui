import {Component, OnInit, Input} from '@angular/core';
import {DataMapService} from '../../service/data-map.service';
import {ServiceItem} from '../../shared/model/service-item.model';
import {ServiceStatusEnum} from '../../shared/enum/global-enums';
import {ServiceItemCallback} from '../../service/dynamodb-services/ddbServiceItems.service';
import {CommonUtilService} from '../../service/common-util.service';

@Component({
  selector: 'app-services-table',
  templateUrl: './services-table.component.html',
  styleUrls: ['./services-table.component.css']
})
export class ServicesTableComponent implements OnInit, ServiceItemCallback {
  _serviceItemArray: Array<ServiceItem>;
  public isLoadingData = false;

  constructor(private dataMapService: DataMapService,
              private commonUtils: CommonUtilService) {
  }

  ngOnInit() {
    this.getServiceItems();
  }

  callback() {
    this.isLoadingData = false;
  }

  callbackWithParam(result: any) {
  }


  getServiceItems(): void {
    this.dataMapService.getItems(this)
      .subscribe(
        resultArray => this._serviceItemArray = resultArray,
        error => console.log('Error getting service items array. ' + error)
      );
  }

  getItemDate(item: ServiceItem): string {
    return this.commonUtils.twoDigitsFormat(item.recolectDate.day) + '-'
      + this.commonUtils.twoDigitsFormat(item.recolectDate.month) + '-'
      + item.recolectDate.year;
  }

  getItemTime(item: ServiceItem): string {
    return this.commonUtils.twoDigitsFormat(item.recolectTime.hour) + ':'
      + this.commonUtils.twoDigitsFormat(item.recolectTime.minute);
  }
}
