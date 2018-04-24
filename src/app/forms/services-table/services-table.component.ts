import {Component, OnInit, Input} from '@angular/core';
import {DataMapService} from '../../service/data-map.service';
import {ServiceItem} from '../../shared/model/service-item.model';
import {CommonUtilService} from '../../service/common-util.service';

@Component({
  selector: 'app-services-table',
  templateUrl: './services-table.component.html',
  styleUrls: ['./services-table.component.css']
})
export class ServicesTableComponent implements OnInit {
  _serviceItemArray: Array<ServiceItem>;
  isLoadingData = false;
  displayError = false;

  constructor(private dataMapService: DataMapService,
              private commonUtils: CommonUtilService) {
  }

  ngOnInit() {
    this.getServiceItems();
  }

  getServiceItems(): void {
    this.dataMapService.getItems()
      .subscribe(
        resultArray => this._serviceItemArray = resultArray,
        error => {
          console.log('Error getting service items array. ' + error);
          this.displayError = true;
        }
      );
  }

  getItemDate(item: ServiceItem): string {
    return this.commonUtils.twoDigitsFormat(item.recolectDate.day) + '-'
      + this.commonUtils.twoDigitsFormat(item.recolectDate.month) + '-'
      + item.recolectDate.year;
  }
}
