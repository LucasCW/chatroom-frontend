import { Component, inject } from '@angular/core';
import { GroupMenuComponent } from '../group-menu/group-menu.component';
import { Store } from '@ngrx/store';
import { statusFeature } from '../../core/store/status/status.reducer';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [GroupMenuComponent, AsyncPipe],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  store = inject(Store);

  user$ = this.store.select(statusFeature.selectLoggedInUser);
}
