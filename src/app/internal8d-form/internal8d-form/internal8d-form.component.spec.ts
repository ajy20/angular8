import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Internal8dFormComponent } from './internal8d-form.component';

describe('Internal8dFormComponent', () => {
  let component: Internal8dFormComponent;
  let fixture: ComponentFixture<Internal8dFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Internal8dFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Internal8dFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
