import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryadjustComponent } from './inventoryadjust.component';

describe('InventoryadjustComponent', () => {
  let component: InventoryadjustComponent;
  let fixture: ComponentFixture<InventoryadjustComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryadjustComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryadjustComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
