import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolkitFormComponent } from './toolkit-form.component';

describe('ToolkitFormComponent', () => {
  let component: ToolkitFormComponent;
  let fixture: ComponentFixture<ToolkitFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolkitFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolkitFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
