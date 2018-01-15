import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryServiceFormComponent } from './delivery-service-form.component';

describe('DeliveryServiceFormComponent', () => {
  let component: DeliveryServiceFormComponent;
  let fixture: ComponentFixture<DeliveryServiceFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryServiceFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryServiceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
