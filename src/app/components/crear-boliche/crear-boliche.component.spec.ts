import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearBolicheComponent } from './crear-boliche.component';

describe('CrearBolicheComponent', () => {
  let component: CrearBolicheComponent;
  let fixture: ComponentFixture<CrearBolicheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearBolicheComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearBolicheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
