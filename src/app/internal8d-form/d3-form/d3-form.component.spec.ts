import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3FormComponent } from './d3-form.component';

describe('D3FormComponent', () => {
  let component: D3FormComponent;
  let fixture: ComponentFixture<D3FormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3FormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
