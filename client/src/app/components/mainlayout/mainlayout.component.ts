import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-mainlayout',
  templateUrl: './mainlayout.component.html',
  styleUrls: ['./mainlayout.component.scss']
})
export class MainlayoutComponent implements OnInit {
  username: string = ''
  role: string = ''
  isSidebarOpen = false; // สถานะ Sidebar สำหรับ Mobile
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.username = this.authService.currentUserValue?.username ?? ''
    this.role = this.authService.currentUserValue?.role ?? ''
  }
  onLogout() {
    this.authService.logout()
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

}
