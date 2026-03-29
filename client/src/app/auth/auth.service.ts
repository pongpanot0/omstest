// auth.service.ts
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export type UserRole = 'ADMIN' | 'CUSTOMER';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);

  // ใช้ BehaviorSubject เพื่อให้ Component อื่นๆ (เช่น Sidebar) Subscribe ค่าที่เปลี่ยนไปได้ทันที
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem('jagota_user');
    return userJson ? JSON.parse(userJson) : null;
  }

  login(role: UserRole) {
    // ในงานจริง: ต้องยิง API ไปที่ NestJS และเก็บ JWT ที่ได้กลับมา
    const mockUser: User = {
      id: '1',
      username: role === 'ADMIN' ? 'admin_jagota' : 'pongpanot_s',
      role: role,
      token: 'mock-jwt-token'
    };

    localStorage.setItem('jagota_user', JSON.stringify(mockUser));
    this.currentUserSubject.next(mockUser);
    this.router.navigate(['/dashboard']);
  }

  logout() {
    localStorage.removeItem('jagota_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
  setUser(userData: { name: string; role: UserRole }) {
    const mockUser: User = {
      id: Math.random().toString(36).substring(2, 9), // สุ่ม ID
      username: userData.name,
      role: userData.role,
      token: 'mock-jwt-token-' + Date.now()
    };

    localStorage.setItem('jagota_user', JSON.stringify(mockUser));
    this.currentUserSubject.next(mockUser);

    // ย้ายการ navigate มาไว้ใน Service หรือปล่อยไว้ที่ Component ก็ได้ครับ
    // ถ้าย้ายมาที่นี่ อย่าลืม inject Router นะครับ
  }
  hasRole(role: UserRole): boolean {
    return this.currentUserValue?.role === role;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }
  getUserRole(): UserRole | null {
    return this.currentUserValue ? this.currentUserValue.role : null;
  }

  // หรือถ้าอยากดึงชื่อ Username มาโชว์ที่ Sidebar
  getUsername(): string {
    return this.currentUserValue ? this.currentUserValue.username : 'Guest';
  }
}
