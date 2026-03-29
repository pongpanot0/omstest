import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdercategoryComponent } from './ordercategory.component';

describe('OrdercategoryComponent', () => {
  let component: OrdercategoryComponent;
  let fixture: ComponentFixture<OrdercategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdercategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdercategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
