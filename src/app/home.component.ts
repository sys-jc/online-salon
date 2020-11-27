import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap  } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { Apollo } from 'apollo-angular';
import * as Query from './graph-ql/queries';
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

class Member {
  googleid:string;
  memid:number;
  eda:number;
  dojoid:number;
  mail:string;
  sei:string;
  mei:string;
  birth:Date;
  class:string;
  tel:string;
  zip:string;
  region:string;
  local:string;
  street:string;
  extend:string;
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
  public djid:number;
  public type:string;
  public dojo:string;
  public form:string;
  public FrmGrp1: FormGroup;
  public FrmGrp2: FormGroup;
  constructor(private oauthService: OAuthService,
              private frmBlder: FormBuilder,         
              private route: ActivatedRoute,
              private apollo: Apollo) {
              }

  ngOnInit() {
    this.googolePageInit();
    this.route.paramMap.subscribe((params: ParamMap)=>{
      var djtmp:string;
      djtmp = params.get('dojo');
      // console.log('ngOnInit',this.djid);
      if (djtmp === null){
        this.djid = +localStorage.getItem('olsalon_dojo');
      }else{
        this.djid = +djtmp;
        this.get_tbldj(this.djid);
        // console.log('ngOnInit set前',this.djid);
        localStorage.setItem('olsalon_dojo', this.djid.toString());
      }
      this.type = params.get('type');
      if (this.type === null){
        this.type = localStorage.getItem('olsalon_type');
      }else{
        localStorage.setItem('olsalon_type', this.type);
      } 
      this.form = params.get('form');
      if (this.form === null){
        this.form = localStorage.getItem('olsalon_form');
      }else{
        localStorage.setItem('olsalon_form', this.form);
      }            
    });
    this.FrmGrp1 = this.frmBlder.group({
      eda: ['', Validators.required],
      sei: ['', Validators.required],
      mei: ['', Validators.required],
      class: ['',''],
      birth: ['', Validators.required],
      tel: ['','']
    }); 
    this.FrmGrp2 = this.frmBlder.group({
      zip: ['', Validators.required],
      region: ['', Validators.required],
      local: ['', Validators.required],
      street: ['', Validators.required],
      extend: ['','']
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
      this.member.googleid = this.claims.sub;
      this.get_tblmem(this.claims);
    }
    // console.log('googleInit',this.djid);
    this.djid = +localStorage.getItem('olsalon_dojo');
    // console.log("login",this.djid);
    this.get_tbldj(this.djid);
    this.form = localStorage.getItem('olsalon_form');
    this.type = localStorage.getItem('olsalon_type');
    // console.log("login",this.dojo);
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
          this.member.googleid=loginfo.sub;
          this.member.sei=loginfo.family_name;
          this.member.mei=loginfo.given_name;
          // console.log('getmemid前', this.djid);
          this.get_memid(this.djid);
          this.member.eda=1;
          this.member.class="未登録";
          // this.member.birth="未登録";
          this.member.mail=loginfo.email;
          this.membs.push(this.member);
        } else { 
          this.flgEx=true; 
          this.membs = data.tblmember;
          this.member = this.membs[0];
        }
        this.FrmGrp1.patchValue(this.member);
        this.FrmGrp2.patchValue(this.member);
      });
  }
  public upd_tblmem():void {    
    if (this.flgEx){
      this.apollo.mutate<any>({
        mutation: Query.UpdateMember,
        variables: {
          "_set": {
            "mail" :  this.member.mail,
            "sei" :   this.FrmGrp1.value.sei,
            "mei" :   this.FrmGrp1.value.mei,
            "class" : this.FrmGrp1.value.class,
            "birth" : moment(this.FrmGrp1.value.bir).format("YYYY-MM-DD"),
            "tel" : this.FrmGrp1.value.tel,
            "zip" : this.FrmGrp2.value.zip,
            "region" : this.FrmGrp2.value.region,
            "local" : this.FrmGrp2.value.local,
            "street" : this.FrmGrp2.value.street,
            "extend" : this.FrmGrp2.value.extend
          } , 
          id: this.member.dojoid,
          gid: this.member.googleid,
          eda : this.FrmGrp1.value.eda,
        },
      }).subscribe(({ data }) => {
        console.log('UpdateMember', data);
      },(error) => {
        console.log('error UpdateMember', error);
      });
    }else{  
      this.flgEx=true;
      this.apollo.mutate<any>({
        mutation: Query.InsertMember,
        variables: {
          "object": {
            "googleid": this.member.googleid,
            "dojoid" : this.djid,
            "memid" : this.member.memid,
            "eda" : this.member.eda,
            "mail" :  this.member.mail,
            "sei" :   this.FrmGrp1.value.sei,
            "mei" :   this.FrmGrp1.value.mei,
            "class" : this.FrmGrp1.value.class,
            "birth" : moment(this.FrmGrp1.value.birth).format("YYYY-MM-DD"),
            "tel" : this.FrmGrp1.value.tel,
            "zip" : this.FrmGrp2.value.zip,
            "region" : this.FrmGrp2.value.region,
            "local" : this.FrmGrp2.value.local,
            "street" : this.FrmGrp2.value.street,
            "extend" : this.FrmGrp2.value.extend
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
    console.log(this.member);
    this.upd_tblmem();
    localStorage.setItem('olsalon_pay', this.dojo);
    this.apollo.watchQuery<any>({
      query: Query.GetQuery5,
      variables: { 
          type : this.type
        },
      })
      .valueChanges
      .subscribe(({ data }) => {
        console.log(data,data.tblfrmfld_by_pk); 
        const site = "https://docs.google.com/forms/d/" + this.form + "/viewform?usp=pp_url" 
        + "&entry." + data.tblfrmfld_by_pk.mail + "=" + this.member.mail 
        + "&entry." + data.tblfrmfld_by_pk.eda + "=" + this.member.eda
        + "&entry." + data.tblfrmfld_by_pk.sei + "=" + this.FrmGrp1.value.sei
        + "&entry." + data.tblfrmfld_by_pk.mei  + "=" + this.FrmGrp1.value.mei
        + "&entry." + data.tblfrmfld_by_pk.birth + "=" + moment(this.FrmGrp1.value.birth).format("YYYY-MM-DD") 
        + "&entry." + data.tblfrmfld_by_pk.class + "=" + this.FrmGrp1.value.class;
        window.location.href=site;
      },(error) => {
        console.log('error get_frmfld', error);
      });
  }

  public get_tbldj(dojoid:number):void {
    this.apollo.watchQuery<any>({
      query: Query.GetQuery2,
      variables: { 
          did : dojoid
        },
      })
      .valueChanges
      .subscribe(({ data }) => {
        this.dojo = data.tblowner[0].dojoname;
        // console.log(data,data.tblowner.dojoname);
      },(error) => {
        console.log('error get_tbldj', error);
      });
  }

  public get_memid(dojoid:number):void{
    // console.log(dojoid);
    this.apollo.watchQuery<any>({
      query: Query.GetQuery3,
      variables: { 
          did : dojoid
        },
      })
      .valueChanges
      .subscribe(({ data }) => {
        // console.log(data.tblmember_aggregate.aggregate.max.memid==null);
        if (data.tblmember_aggregate.aggregate.max.memid==null) {
          this.member.memid = 1;
        } else {
          this.member.memid = data.tblmember_aggregate.aggregate.max.memid + 1; 
        }
      });
  }

  changeEda(eda:number):void {
    console.log(eda);
    this.member = this.membs.find(e => e.eda === eda);
    this.FrmGrp1.patchValue(this.member);
    this.FrmGrp2.patchValue(this.member);
  }
  insEda():void {
    console.log(this.member);
    this.upd_tblmem();
    let eda:number[] = this.membs.map(function (p) {
      return p.eda;
    });
    this.member.mei="";
    this.member.eda=Math.max.apply(null, eda)+1;
    this.member.class="";
    this.member.birth=new Date();
    this.membs.push(this.member);
    this.changeEda(this.member.eda);
    this.flgEx=false;
    this.upd_tblmem();
  }
}
