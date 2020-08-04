import { Component } from '@angular/core';
import { SocialUser, SocialAuthService, GoogleLoginProvider } from 'angularx-social-login';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  user: SocialUser;
  loggedIn: boolean=false;

  constructor(private authService:  SocialAuthService) { }  
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.loggedIn = true;
  }
  signOut(): void {
    this.authService.signOut();
    this.loggedIn = false;
  }
}


