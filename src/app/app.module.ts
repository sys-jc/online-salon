import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { HttpClientModule } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';
// import * as $ from 'jquery';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { GraphQLModule } from './graph-ql/graph-ql.module';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PayComponent } from './pay.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    GraphQLModule,
    FormsModule 
    ,MatButtonModule
    ,MatCardModule
    ,MatDatepickerModule
    ,MatFormFieldModule
    ,MatIconModule
    ,MatInputModule
    ,MatNativeDateModule,
    BrowserAnimationsModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'ja-JP'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
