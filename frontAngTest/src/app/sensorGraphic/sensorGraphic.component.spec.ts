import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorGraphicComponent } from './sensorGraphic.component';

describe('SensorGraphicComponent', () => {
  let component: SensorGraphicComponent;
  let fixture: ComponentFixture<SensorGraphicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorGraphicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
