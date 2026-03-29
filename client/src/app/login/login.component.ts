import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  ngOnInit(): void {

  }


  isLoginMode = true; // สถานะเริ่มต้นเป็น Login

  // Data model
  authData = {
    username: '',
    password: '',
    email: '' // สำหรับ Register
  };

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if (this.isLoginMode) {
      // Logic สำหรับ Login
      const role = this.authData.username === 'admin' ? 'ADMIN' : 'CUSTOMER';
      this.authService.setUser({ name: this.authData.username, role: role });
      this.router.navigate(['/dashboard']);
    } else {
      // Logic สำหรับ Register
      console.log('Registering...', this.authData);
      alert('Registration successful! Please login.');
      this.isLoginMode = true; // สมัครเสร็จแล้วส่งกลับไปหน้า Login
    }
  }
}
