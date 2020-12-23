import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export class Member {
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
@Injectable({
  providedIn: 'root'
})
export class MemberService {
  public claims:any;
  public member:Member=new Member();
  public membs :Member[]=[];
  public flgEx:boolean=false;
  public flgSm:boolean=false;
  public djid:number;
  public type:string;
  public dojo:string;
  public form:string;

  //コンポーネント間通信用
  public subject = new Subject<string>();
  public observe = this.subject.asObservable();

  constructor() { }
}
