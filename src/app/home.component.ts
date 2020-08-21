import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap  } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { Apollo } from 'apollo-angular';
import * as Query from './graph-ql/queries';
import * as moment from 'moment';

class Member {
  gid:number;
  sei:string;
  mei:string;
  memid:number;
  memeda:number;
  class:string;
  birth:Date;
  mail:string;
  id:number;
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
  claims:any;
  public member:Member=new Member();
  public membs :Member[]=[];
  public flgEx:boolean=false;
  public djid:string;
  public dojo:string;
  public form:string;
  constructor(private oauthService: OAuthService,
              // private sanitizer: DomSanitizer,          
              private route: ActivatedRoute,
              private apollo: Apollo) {
              }

  ngOnInit() {
    this.googolePageInit();
    this.route.paramMap.subscribe((params: ParamMap)=>{
      this.djid = params.get('dojo');
      if (this.djid === null){
        this.djid = localStorage.getItem('olsalon_dojo');
      }else{
        this.get_tbldj(this.djid);
        localStorage.setItem('olsalon_dojo', this.djid);
      }
      this.form = params.get('form');
      if (this.form === null){
        this.form = localStorage.getItem('olsalon_form');
      }else{
        localStorage.setItem('olsalon_form', this.form);
      }      
    });
  }

  public login() {
    this.oauthService.revokeTokenAndLogout();
    this.oauthService.initLoginFlow();
    this.googolePageInit();
  }

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
      this.member.gid = this.claims.sub;
      this.get_tblmem(this.claims);
    }
  }

  public get_tblmem(loginfo):void {
    this.membs=[];
    
    this.apollo.watchQuery<any>({
      query: Query.GetQuery1,
      variables: { 
          gid : loginfo.sub,
          did : this.djid
        },
      })
      .valueChanges
      .subscribe(({ data }) => {
        if (data.tblmember.length==0){
          this.flgEx=false;
          this.member.sei=loginfo.family_name;
          this.member.mei=loginfo.given_name;
          console.log('getmemid前', this.djid);
          this.get_memid(this.djid);
          this.member.memeda=1;
          this.member.class="未登録";
          // this.member.birth="未登録";
          this.member.mail=loginfo.email;
        } else { 
          this.flgEx=true; 
          this.membs = data.tblmember;
          this.member = this.membs[0];
        }
      });
  }
  public upd_tblmem():void {    
    if (this.flgEx){
      this.apollo.mutate<any>({
        mutation: Query.UpdateMember,
        variables: {
          "_set": {
            "mail" :  this.member.mail,
            "sei" :   this.member.sei,
            "mei" :   this.member.mei,
            "class" : this.member.class,
            "birth" : moment(this.member.birth).format("YYYY-MM-DD") },
          id: this.member.id 
        },
      }).subscribe(({ data }) => {
        console.log('UpdateMember', data);
      },(error) => {
        console.log('error UpdateMember', error);
      });
    }else{  
      this.apollo.mutate<any>({
        mutation: Query.InsertMember,
        variables: {
          "object": {
            "googleid": this.member.gid,
            "dojoid" : this.djid,
            "mail" :  this.member.mail,
            "sei" :   this.member.sei,
            "mei" :   this.member.mei,
            "class" : this.member.class,
            "birth" : moment(this.member.birth).format("YYYY-MM-DD"),
            "memid" : this.member.memid,
            "memeda" : this.member.memeda,
           }
        },
      }).subscribe(({ data }) => {
        console.log('InsertMember', data);
      },(error) => {
        console.log('error InsertMember', error);
      });
    }  
  }
  goForm(){
    this.upd_tblmem()
    const param = this.form.split("~");
    const site = "https://docs.google.com/forms/d/" + param[0] + "/viewform?usp=pp_url" 
     + "&entry." + param[1] + "=" + this.member.mail 
     + "&entry." + param[2] + "=" + this.member.sei
     + "&entry." + param[3] + "=" + this.member.mei
     + "&entry." + param[4] + "=" + moment(this.member.birth).format("YYYY-MM-DD") 
     + "&entry." + param[5] + "=" + this.member.class;
    window.location.href=site;
  }

  public get_tbldj(dojoid:string):void {
    this.membs=[];
    this.apollo.watchQuery<any>({
      query: Query.GetQuery2,
      variables: { 
          did : dojoid
        },
      })
      .valueChanges
      .subscribe(({ data }) => {
        this.dojo = data.tbldojo_by_pk.dojoname;
      });
  }

  public get_memid(dojoid:string):void{
    console.log(dojoid);
    this.apollo.watchQuery<any>({
      query: Query.GetQuery3,
      variables: { 
          did : dojoid
        },
      })
      .valueChanges
      .subscribe(({ data }) => {
        console.log(data.tblmember_aggregate.aggregate.max.memid==null);
        if (data.tblmember_aggregate.aggregate.max.memid==null) {
          this.member.memid = 1;
        } else {
          this.member.memid = data.tblmember_aggregate.aggregate.max.memid + 1; 
        }
      });
  }
}
