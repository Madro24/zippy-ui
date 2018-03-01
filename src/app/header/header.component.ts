import {Component, OnInit} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public isCollapsed = true;
  public searchItem: string;

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  toggleMenu() {
    this.isCollapsed = !this.isCollapsed;
  }

  searchServiceItem() {
    if (this.searchItem != null && this.searchItem.length > 0) {
      this.router.navigate(['/serviceItem/', this.searchItem]);
    }
  }


}
