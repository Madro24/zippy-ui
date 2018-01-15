import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-senderform',
  templateUrl: './senderform.component.html',
  styleUrls: ['./senderform.component.css']
})
export class SenderformComponent implements OnInit {
  time = { hour: 13, minute: 30 };
  constructor() {
  }

  ngOnInit() {
  }

}
