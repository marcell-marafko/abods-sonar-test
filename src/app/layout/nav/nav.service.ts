import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavService {
  isOpen = false;

  toggleMenu() {
    this.isOpen = !this.isOpen;
    document.body.classList.toggle('js-nav-open');
  }

  closeMenu() {
    this.isOpen = false;
    document.body.classList.remove('js-nav-open');
  }

  navClickOutside(e: Event) {
    if (this.isOpen) {
      const selectedEl = e.target as HTMLElement;
      if (selectedEl.id !== 'nav-toggle') {
        this.toggleMenu();
      }
    }
  }
}
