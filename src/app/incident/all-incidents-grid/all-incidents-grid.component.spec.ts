import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllIncidentsGridComponent } from './all-incidents-grid.component';

describe('AllIncidentsGridComponent', () => {
  let component: AllIncidentsGridComponent;
  let fixture: ComponentFixture<AllIncidentsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllIncidentsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllIncidentsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
