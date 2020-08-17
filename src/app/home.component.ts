import { Component, OnInit } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { Apollo } from 'apollo-angular';
import * as Query from './graph-ql/queries';

// declare var gapi:any;

class Member {
  sei:string;
  mei:string;
  dojoid:number;
  dojoeda:number;
  class:string;
  grade:string;
  mail:string;
  constructor(init?:Partial<Member>) {
      Object.assign(this, init);
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // public auth2: any;
  claims:any;
  public member:Member=new Member();
  public membs :Member[]=[];
  public flgEx:boolean=false;
  constructor(private oauthService: OAuthService,
              private apollo: Apollo) {}

  ngOnInit() {
    this.googolePageInit();
    // console.log(this.oauthService.getIdentityClaims());
  }

  // public googleInit() {
  //   let that = this;
  //   let result = false;
  //   gapi.load('auth2', function () {
  //     that.auth2 = gapi.auth2.init({
  //       client_id: '913080910103-9ijeb0amimtamudqpqfdkb42vqvfcptj.apps.googleusercontent.com',
  //       cookiepolicy: 'single_host_origin',
  //       scope: 'profile email'
  //     });
  //     // console.log(that);
  //     that.auth2.then(that.checkForLoggedInUser(that));

  //     that.attachSignin(that.element.nativeElement.querySelector('#googleBtn'));
  //   });
  //   gapi.signin2.render(
  //     "googleBtn",
  //     {
  //       "scope": "profile email",
  //       "theme": "dark"
  //     });
  // }

  // public attachSignin(element) {
  //   let that = this;
  //   this.auth2.attachClickHandler(element, {},
  //     function (googleUser) {

  //       let profile = googleUser.getBasicProfile();
  //       // console.log(profile);
  //       // console.log('Token || ' + googleUser.getAuthResponse().id_token);
  //       that.get_tblmem(profile.getId());
  //       // console.log('ID: ' + profile.getId());
  //       // console.log('Name: ' + profile.getName());
  //       // console.log('Image URL: ' + profile.getImageUrl());
  //       // console.log('Email: ' + profile.getEmail());
  //       // //YOUR CODE HERE
        
  //       console.log(that.member.mail,profile.getEmail());
  //       if (!that.member.mail || that.member.mail==='undefined') {
  //         that.member.mail = profile.getEmail();
  //       }

  //     }, function (error) {
  //       console.log(JSON.stringify(error, undefined, 2));
  //     });
  // }
  // public checkForLoggedInUser(lcthis) {
  //   let auth = gapi.auth2.getAuthInstance();
  //   // console.log(gapi.auth2.getAuthInstance().isSignedIn.get());
  //   let profile = auth.currentUser.get().getBasicProfile();
  //   console.log(auth.currentUser,auth.currentUser.get());
  //   lcthis.get_tblmem(profile.getId());
  //   if (auth.isSignedIn.get()) {
  //     // let profile = auth.currentUser.get().getBasicProfile();
  //     // console.log(lcthis,profile.getId());
  //     lcthis.get_tblmem(profile.getId());
  //     // console.log('Name: ' + profile.getName());
  //     // console.log('Image URL: ' + profile.getImageUrl());
  //     // console.log('Email: ' + profile.getEmail());
  //     if (!lcthis.member.mail) {
  //       lcthis.member.mail = profile.getEmail();
  //     }
  //   }
  // }

  public login() {
    this.oauthService.revokeTokenAndLogout();
    this.oauthService.initLoginFlow();
    // this.oauthService.tryLogin();
  }

  // public get name() {
  //   this.claims = this.oauthService.getIdentityClaims();
  //   if (!this.claims) {
  //     return null;
  //   }
  //   return this.claims['name'];
  // }

  // public get email() {
  //   this.claims = this.oauthService.getIdentityClaims();
  //   if (!this.claims) {
  //     return null;
  //   }
  //   return this.claims['email'];
  // }

  // Google ページ初期化
  private async googolePageInit() {

    this.oauthService.setStorage(localStorage);
    await this.oauthService.setupAutomaticSilentRefresh();


  // この非同期処理を行わないとユーザー情報が取得できない
    await this.oauthService.loadDiscoveryDocument()
    .then(() => this.oauthService.tryLogin());

    // すでに Google にログインしている場合ログイン後の画面を表示
    this.claims =  this.oauthService.getIdentityClaims();
    if (this.claims) {
      this.get_tblmem(this.claims);
    } else {

    }
  }

  public get_tblmem(loginfo):void {
    this.membs=[];
    this.apollo.watchQuery<any>({
      query: Query.GetQuery1,
      variables: { 
          gid : loginfo.sub
        },
      })
      .valueChanges
      .subscribe(({ data }) => {
        if (data.tblmember.length==0){
          this.flgEx=false;
          this.member.sei=loginfo.family_name;


        } else { 
          this.flgEx=true; 
          this.membs = data.tblmember;
          this.member = this.membs[0];
        }
      });
  }
  public upd_tblmem():void {
    
    this.oauthService.revokeTokenAndLogout();
    
    console.log(this.oauthService.getIdentityClaims());
    
  }



}
