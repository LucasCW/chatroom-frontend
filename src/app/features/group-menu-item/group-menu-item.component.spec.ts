import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupMenuItemComponent } from './group-menu-item.component';

describe('GroupMenuItemComponent', () => {
  let component: GroupMenuItemComponent;
  let fixture: ComponentFixture<GroupMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupMenuItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
