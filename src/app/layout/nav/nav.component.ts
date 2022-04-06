import { Component, OnInit } from '@angular/core';
import { initAll } from 'govuk-frontend';
import { NavService } from './nav.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  constructor(public navService: NavService) {}

  ngOnInit(): void {
    initAll();
  }
}
