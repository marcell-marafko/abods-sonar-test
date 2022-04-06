import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SharedModule } from 'src/app/shared/shared.module';
import { TopBarComponent } from './top-bar/top-bar.component';
import { UserAccountComponent } from './nav/user-account/user-account.component';
import { NavComponent } from './nav/nav.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { SearchBoxComponent } from './top-bar/search-box/search-box.component';
import { InnerComponent } from './inner/inner.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { PageComponent } from './page/page.component';
import { NavToggleComponent } from './nav/nav-toggle/nav-toggle.component';
@NgModule({
  declarations: [
    TopBarComponent,
    UserAccountComponent,
    NavComponent,
    PageHeaderComponent,
    SearchBoxComponent,
    InnerComponent,
    HeaderComponent,
    FooterComponent,
    PageComponent,
    NavToggleComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SharedModule,
    AngularSvgIconModule.forRoot(),
    HttpClientModule,
    ClickOutsideModule,
    NgxTippyModule,
  ],
  providers: [],
  exports: [
    TopBarComponent,
    UserAccountComponent,
    InnerComponent,
    NavComponent,
    PageHeaderComponent,
    SearchBoxComponent,
    HeaderComponent,
    FooterComponent,
    ClickOutsideModule,
    PageComponent,
  ],
})
export class LayoutModule {}
