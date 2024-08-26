import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D8FormComponent } from './d8-form.component';

describe('D8FormComponent', () => {
  let component: D8FormComponent;
  let fixture: ComponentFixture<D8FormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D8FormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D8FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
