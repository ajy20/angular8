import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D6FormComponent } from './d6-form.component';

describe('D6FormComponent', () => {
  let component: D6FormComponent;
  let fixture: ComponentFixture<D6FormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D6FormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D6FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
