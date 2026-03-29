// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // GET: ดึงข้อมูล (Async)
  async get<T>(endpoint: string): Promise<T> {
    try {
      const observable = this.http.get<T>(`${this.baseUrl}/${endpoint}`).pipe(
        retry(1),
        catchError(this.handleError)
      );
      return await firstValueFrom(observable);
    } catch (error) {
      throw error;
    }
  }

  // POST: สร้างข้อมูล (Async)
  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const observable = this.http.post<T>(`${this.baseUrl}/${endpoint}`, data).pipe(
        catchError(this.handleError)
      );
      return await firstValueFrom(observable);
    } catch (error) {
      throw error;
    }
  }

  // PATCH: อัปเดตข้อมูล (Async)
  async patch<T>(endpoint: string, data: any): Promise<T> {
    try {
      const observable = this.http.patch<T>(`${this.baseUrl}/${endpoint}`, data).pipe(
        catchError(this.handleError)
      );
      return await firstValueFrom(observable);
    } catch (error) {
      throw error;
    }
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // ดึง message จาก NestJS ที่เราเขียนไว้ (เช่น BadRequestException)
      errorMessage = error.error?.message || `Error Code: ${error.status}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
