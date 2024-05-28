import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ChatService } from '../../core/services/chat.service';

@Component({
  selector: 'app-message-box',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './message-box.component.html',
  styleUrl: './message-box.component.scss',
})
export class MessageBoxComponent {
  chatService = inject(ChatService);
  formBuilder = inject(FormBuilder);

  messageForm = this.formBuilder.group({
    message: '',
  });

  onSubmit() {
    this.chatService.send(this.messageForm.controls.message.value!);
  }
}
