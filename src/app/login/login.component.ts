import { AsyncPipe } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable, first, map, startWith, switchMap } from 'rxjs';
import { User } from '../core/data/User';
import { ChatService } from '../core/services/chat.service';
import { UserApiActions } from '../core/store/user/user-api.actions';
import { userFeature } from '../core/store/user/user.reducer';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    AsyncPipe,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  @Input()
  modal!: NgbActiveModal;

  store = inject(Store);
  chatService = inject(ChatService);

  users$ = this.store.select(userFeature.selectAll);

  onLogin() {
    if (typeof this.userControl.value === 'string') {
      console.log('please pick a user');
    } else {
      const userId = this.userControl.value?._id!;
      this.store
        .select(userFeature.selectLoggedInUser)
        .pipe(first())
        .subscribe((user) => {
          if (!!user) {
            this.chatService.logout(userId);
          }

          this.store.dispatch(UserApiActions.loadLoggedInUser({ userId }));
          console.log(2);
          this.chatService.loadPrivateChannels(userId);
          console.log(1);
          this.chatService.login(userId);
        });
    }
    this.modal.close();
  }

  displayFn(user: User) {
    return user.username;
  }

  userControl = new FormControl<User | string>('');
  filteredOptions!: Observable<User[]>;

  ngOnInit() {
    this.filteredOptions = this.userControl.valueChanges.pipe(
      startWith(''),
      switchMap((value) => {
        if (typeof value !== 'string') {
          return this._filter('');
        }
        return this._filter(value || '');
      })
    );
  }

  private _filter(value: string) {
    const filterValue = value.toLowerCase();

    return this.users$.pipe(
      map((users) => {
        return users.filter((user) => {
          return user.username.toLocaleLowerCase().includes(filterValue);
        });
      })
    );
  }
}
