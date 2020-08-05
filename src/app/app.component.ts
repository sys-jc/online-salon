import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { authConfig } from './auth.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{

  constructor(private oauthService: OAuthService) {
    this.configureWithNewConfigApi();
  }

  private async configureWithNewConfigApi() {
    this.oauthService.configure(authConfig);
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    console.log(this.oauthService);
    // awaitとしないとユーザーの情報が取得できない。
    await this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

}


