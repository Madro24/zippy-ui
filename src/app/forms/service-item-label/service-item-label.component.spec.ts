import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceItemLabelComponent } from './service-item-label.component';

describe('ServiceItemLabelComponent', () => {
  let component: ServiceItemLabelComponent;
  let fixture: ComponentFixture<ServiceItemLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceItemLabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceItemLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
