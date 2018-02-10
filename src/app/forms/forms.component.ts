import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ServiceItem } from "../shared/model/service-item.model";


@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class FormsComponent implements OnInit {
  private serviceItem = new ServiceItem();
  displayDeliveryServiceForm = false;



  constructor(public router: Router) { }

  ngOnInit() {
  }

  addDeliveryService() {
    this.displayDeliveryServiceForm = true;
  }

  viewSenderForm() {
    this.displayDeliveryServiceForm = false;
  }

  isSenderForm() {
    return !this.displayDeliveryServiceForm;
  }

  isDeliveryForm() {
    return this.displayDeliveryServiceForm;
  }

}
