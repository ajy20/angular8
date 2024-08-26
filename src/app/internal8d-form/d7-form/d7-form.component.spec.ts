import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D7FormComponent } from './d7-form.component';

describe('D7FormComponent', () => {
  let component: D7FormComponent;
  let fixture: ComponentFixture<D7FormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D7FormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D7FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
