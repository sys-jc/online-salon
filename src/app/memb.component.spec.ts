import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembComponent } from './memb.component';

describe('MembComponent', () => {
  let component: MembComponent;
  let fixture: ComponentFixture<MembComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
