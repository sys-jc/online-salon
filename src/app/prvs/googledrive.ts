import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, filter, reduce } from 'rxjs/operators';

/*
  Generated class for the GoogleDrive provider.
  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GoogleDriveProvider {
  data: any = null;

  constructor(public http: HttpClient) {}

  load( id,wid ) {
    var url = 'https://spreadsheets.google.com/feeds/list/' + id + '/' + wid + '/public/values?alt=json';
    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      this.http.get(url)
        .subscribe( (data:any) => {
          // console.log( 'Raw Data', data );
          this.data = data.feed.entry;

          let returnArray: Array<any> = [];
          if( this.data && this.data.length > 0 ) {
            this.data.forEach( ( entry, index ) => {
              var obj = {};
              for( let x in entry ) {
                if( x.includes('gsx$') && entry[x].$t ){
                  obj[x.split('$')[1]] = entry[x]['$t'];
                  // console.log( x.split('$')[1] + ': ' + entry[x]['$t'] );
                }
              }
              returnArray.push( obj );
            });
          }
          resolve(returnArray);
        });
    });
  }
}