import { Component, OnInit, Input } from '@angular/core';
import { ServiceTypeEnum } from "../../shared/enum/global-enums";
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { ServiceItem } from "../../shared/model/service-item.model";

const now = new Date();

@Component({
  selector: 'app-senderform',
  templateUrl: './senderform.component.html',
  styleUrls: ['./senderform.component.css']
})
export class SenderformComponent implements OnInit {
  @Input() serviceItem: ServiceItem;

  // model: NgbDateStruct;
  // date: {year: number, month: number};
  // time = { hour: 8, minute: 0 };

  constructor() {

  //  this.model = {year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate()};
  }

  ngOnInit() {
  }


  getServiceTypes() : Array<string> {
        var keys = Object.keys(ServiceTypeEnum);
        return keys.slice(keys.length / 2);
    }
}
