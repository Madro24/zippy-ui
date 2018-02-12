import { Component, OnInit, Input } from '@angular/core';
import { Destination } from "../../shared/model/destination.model";

@Component({
  selector: 'app-delivery-service-form',
  templateUrl: './delivery-service-form.component.html',
  styleUrls: ['./delivery-service-form.component.css']
})
export class DeliveryServiceFormComponent implements OnInit {
  @Input() destinationItem: Destination;

  constructor() { }

  ngOnInit() {
  }

}
