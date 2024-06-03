import { Component, Input } from '@angular/core';
import { History } from '../../core/data/History';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  @Input()
  history!: History;
}
