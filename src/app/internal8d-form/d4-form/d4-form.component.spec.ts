import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D4FormComponent } from './d4-form.component';

describe('D4FormComponent', () => {
  let component: D4FormComponent;
  let fixture: ComponentFixture<D4FormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D4FormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D4FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
