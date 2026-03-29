import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService, UserRole } from '../auth/auth.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private vcr: ViewContainerRef,
    private authService: AuthService
  ) { }

  @Input() set appHasRole(role: UserRole) {
    const userRole = this.authService.getUserRole(); // เรียกใช้ Getter ที่เราเพิ่งเพิ่ม

    if (userRole === role && !this.hasView) {
      this.vcr.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (userRole !== role && this.hasView) {
      this.vcr.clear();
      this.hasView = false;
    }
  }
}
