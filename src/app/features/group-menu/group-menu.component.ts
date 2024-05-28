import { AsyncPipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { statusFeature } from '../../core/store/status/status.reducer';
import { GroupMenuItemComponent } from '../group-menu-item/group-menu-item.component';
import { Group } from '../../core/data/Group';

@Component({
  selector: 'app-group-menu',
  standalone: true,
  imports: [AsyncPipe, GroupMenuItemComponent],
  templateUrl: './group-menu.component.html',
  styleUrl: './group-menu.component.scss',
})
export class GroupMenuComponent {
  store = inject(Store);

  @Input()
  group!: Group;

  groups$ = this.store.select(statusFeature.selectGroups);
}
