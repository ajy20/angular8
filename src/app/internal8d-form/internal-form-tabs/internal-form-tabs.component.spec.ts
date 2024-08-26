import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalFormTabsComponent } from './internal-form-tabs.component';

describe('InternalFormTabsComponent', () => {
  let component: InternalFormTabsComponent;
  let fixture: ComponentFixture<InternalFormTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalFormTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalFormTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
