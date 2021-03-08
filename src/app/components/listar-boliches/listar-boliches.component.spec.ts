import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarBolichesComponent } from './listar-boliches.component';

describe('ListarBolichesComponent', () => {
  let component: ListarBolichesComponent;
  let fixture: ComponentFixture<ListarBolichesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarBolichesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarBolichesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
