import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryhistoryComponent } from './inventoryhistory.component';

describe('InventoryhistoryComponent', () => {
  let component: InventoryhistoryComponent;
  let fixture: ComponentFixture<InventoryhistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryhistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
