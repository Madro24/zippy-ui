import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class FormsComponent implements OnInit {
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
