import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QcComponent } from './qc.component';

describe('QcComponent', () => {
  let component: QcComponent;
  let fixture: ComponentFixture<QcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
