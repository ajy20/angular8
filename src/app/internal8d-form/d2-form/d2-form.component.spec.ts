import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D2FormComponent } from './d2-form.component';

describe('D2FormComponent', () => {
  let component: D2FormComponent;
  let fixture: ComponentFixture<D2FormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D2FormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D2FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
