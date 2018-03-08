import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceItemDDBService } from '../service/ddbServiceItems.service';

const now = new Date();

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css']
})
export class FormsComponent implements OnInit {




  constructor(public router: Router, public serviceItemDDB: ServiceItemDDBService) {


  }

  ngOnInit() {
  }



}
