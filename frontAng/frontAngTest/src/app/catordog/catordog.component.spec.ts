import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatordogComponent } from './catordog.component';

describe('CatordogComponent', () => {
  let component: CatordogComponent;
  let fixture: ComponentFixture<CatordogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatordogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatordogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
