import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {GifSearchResponse} from '../model/gif';

@Injectable({
  providedIn: 'root'
})
export class GifService {
  private host = environment.apiUrl;
  private PAGE_SIZE = 25;
  constructor(private http: HttpClient) { }

  public findGif(searchText: string, limit?: number, offset?: number): Observable<GifSearchResponse> {
    let params = new HttpParams();
    params = params.append('q', searchText);

    if (offset !== null && offset !== undefined) {
      params = params.append('offset', String(offset));
    }

    if (!limit) {
      params = params.append('limit', String(this.PAGE_SIZE));
    } else {
      params = params.append('limit', String(limit));
    }

    const httpOptions = { params };

    return this.http.get<GifSearchResponse>(`${this.host}/api/gif-search`, httpOptions);
  }

  public get pageSize(): number {
    return this.PAGE_SIZE;
  }
}
