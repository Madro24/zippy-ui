import { Component, OnInit } from '@angular/core';
import { DataMapService } from '../../service/data-map.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceItem } from '../../shared/model/service-item.model';



@Component({
  selector: 'app-service-item-label',
  templateUrl: './service-item-label.component.html',
  styleUrls: ['./service-item-label.component.css']
})
export class ServiceItemLabelComponent implements OnInit {
  public serviceItem: ServiceItem;
  private itemId: string;

  constructor(private router: Router, private actRoute: ActivatedRoute, public dataMapService: DataMapService) { }

  ngOnInit() {
    console.log('service item label init');
    this.itemId = this.actRoute.snapshot.params['itemId'];
    console.log('index:' + this.itemId);
    if (this.itemId != null) {
      this.dataMapService.getServiceItemById(this.itemId)
        .subscribe(
          item => this.serviceItem = item,
          error => {
            console.log('Error getting service items array. ' + error);
            this.router.navigate(['/admin-home']);
          }
        );

      console.log('this.serviceItem:' + this.serviceItem.itemId);

    } else {
      this.router.navigate(['/serviceItemList']);
    }
  }

  back() {
      this.router.navigate(['/serviceItem/', this.itemId]);
  }
}
