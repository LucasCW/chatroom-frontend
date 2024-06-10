import { AsyncPipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs';
import { Group, GroupType } from '../../core/data/Group';
import { groupFeature } from '../../core/store/group/group.reducer';
import { GroupMenuItemComponent } from '../group-menu-item/group-menu-item.component';

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

  groups$ = this.store
    .select(groupFeature.selectGroupByType(GroupType.public))
    .pipe(filter((groups) => groups.length > 0));
}
