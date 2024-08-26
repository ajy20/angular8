import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IgxFilterComponent } from './igx-filter.component';

describe('IgxFilterComponent', () => {
  let component: IgxFilterComponent;
  let fixture: ComponentFixture<IgxFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IgxFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IgxFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
