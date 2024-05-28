import { Component } from '@angular/core';
import { GroupMenuComponent } from '../group-menu/group-menu.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [GroupMenuComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {}
