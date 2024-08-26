import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessFunctionComponent } from './process-function.component';

describe('ProcessFunctionComponent', () => {
  let component: ProcessFunctionComponent;
  let fixture: ComponentFixture<ProcessFunctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessFunctionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessFunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
