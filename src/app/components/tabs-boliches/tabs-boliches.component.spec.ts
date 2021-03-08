import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsBolichesComponent } from './tabs-boliches.component';

describe('TabsBolichesComponent', () => {
  let component: TabsBolichesComponent;
  let fixture: ComponentFixture<TabsBolichesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabsBolichesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsBolichesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
