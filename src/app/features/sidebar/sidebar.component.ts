import { AsyncPipe } from '@angular/common';
import { Component, TemplateRef, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { ChatService } from '../../core/services/chat.service';
import { userFeature } from '../../core/store/user/user.reducer';
import { LoginComponent } from '../../login/login.component';
import { GroupMenuComponent } from '../group-menu/group-menu.component';
import { PrivateChannelsComponent } from '../private-channels/private-channels.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  imports: [
    AsyncPipe,
    MatInputModule,
    MatSelectModule,
    GroupMenuComponent,
    MatFormFieldModule,
    PrivateChannelsComponent,
    LoginComponent,
  ],
})
export class SidebarComponent {
  store = inject(Store);
  chatService = inject(ChatService);

  user$ = this.store.select(userFeature.selectUserById);

  private modalService = inject(NgbModal);

  open(content: TemplateRef<any>) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
      })
      .result.then((result) => {
        console.log(`Closed with: ${result}`);
      });
  }
}
