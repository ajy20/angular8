import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D5FormComponent } from './d5-form.component';

describe('D5FormComponent', () => {
  let component: D5FormComponent;
  let fixture: ComponentFixture<D5FormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D5FormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D5FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
