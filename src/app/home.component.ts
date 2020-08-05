import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  claims:any;
  constructor(private oauthService: OAuthService) {
  }

  ngOnInit(): void {
    this.googolePageInit();

  }

  public login() {
      this.oauthService.initImplicitFlow();
  }

  // public logout() {
  //     this.oauthService.logOut();
  // }

  public get name() {
      this.claims = this.oauthService.getIdentityClaims();
      if (!this.claims) {
        return null;
      }
      return this.claims['name'];
  }

  public get email() {
    this.claims = this.oauthService.getIdentityClaims();
    if (!this.claims) {
      return null;
    }
    return this.claims['email'];
  }

  // public get token() {
  //   const accessToken = this.oauthService.getAccessToken();
  //   if (!accessToken) {
  //     return null;
  //   }
  //   return accessToken;
  // }
  // Google ページ初期化
  private async googolePageInit() {

    this.oauthService.setStorage(localStorage);
    // await this.oauthService.loadDiscoveryDocumentAndTryLogin();
    await this.oauthService.setupAutomaticSilentRefresh();


  // この非同期処理を行わないとユーザー情報が取得できない
  await this.oauthService.loadDiscoveryDocument()
    .then(() => this.oauthService.tryLogin())
    // .then(() => {
    //   if (!this.oauthService.hasValidAccessToken()) {
    //     this.oauthService.silentRefresh((result) => {
    //       console.log(result);
    //     });
    //   }
    // })
    ;

    // すでに Google にログインしている場合ログイン後の画面を表示
    this.claims =  this.oauthService.getIdentityClaims();

  //   // if (claims) {
  //   //       // AppCompoment の値を書き換え
  //   //       this.commonService.onNotifySharedDataChanged(true);

  //   //       // ルーティングでリダイレクト
  //   //       this._zone.run(() => {
  //   //         this._router.navigate(['listall']);
  //   //       });
  //   //   }
  }
}
