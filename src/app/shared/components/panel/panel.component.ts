import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent {
  @Output() closing = new EventEmitter();
  @Output() opening = new EventEmitter();

  @ViewChild('closeButton') closeButton?: ElementRef;
  isOpen = false;

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.opening.emit();
    this.isOpen = true;
    setTimeout(() => this.closeButton?.nativeElement.focus(), 0);
    document.body.classList.add('js-panel-open');
  }

  close() {
    this.closing.emit();
    this.isOpen = false;
    document.body.classList.remove('js-panel-open');
  }

  panelClickOutside(e: Event) {
    if (this.isOpen) {
      const selectedEl = e.target as HTMLElement;
      const panelToggle = document.getElementById('panel-toggle');
      if (panelToggle && !panelToggle.contains(selectedEl)) {
        this.close();
      }
    }
  }
}
