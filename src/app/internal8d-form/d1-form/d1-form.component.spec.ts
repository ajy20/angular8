import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D1FormComponent } from './d1-form.component';

describe('D1FormComponent', () => {
  let component: D1FormComponent;
  let fixture: ComponentFixture<D1FormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D1FormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D1FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
