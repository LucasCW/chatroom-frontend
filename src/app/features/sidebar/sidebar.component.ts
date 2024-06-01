import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';
import { UserApiActions } from '../../core/store/user/user-api.actions';
import { userFeature } from '../../core/store/user/user.reducer';
import { GroupMenuComponent } from '../group-menu/group-menu.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    GroupMenuComponent,
    AsyncPipe,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  store = inject(Store);

  user$ = this.store
    .select(userFeature.selectUserById)
    .pipe(filter((user) => user != null));

  users$ = this.store.select(userFeature.selectAll);

  onSelect(event: MatSelectChange) {
    this.store.dispatch(
      UserApiActions.loadLoggedInUser({ userId: event.value })
    );
  }
}
