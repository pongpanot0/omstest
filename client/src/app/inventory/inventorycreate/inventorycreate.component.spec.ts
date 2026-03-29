import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorycreateComponent } from './inventorycreate.component';

describe('InventorycreateComponent', () => {
  let component: InventorycreateComponent;
  let fixture: ComponentFixture<InventorycreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventorycreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventorycreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
