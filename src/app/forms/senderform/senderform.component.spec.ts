import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SenderformComponent } from './senderform.component';

describe('SenderformComponent', () => {
  let component: SenderformComponent;
  let fixture: ComponentFixture<SenderformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SenderformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SenderformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
