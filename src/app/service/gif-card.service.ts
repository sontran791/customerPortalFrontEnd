import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Gif} from '../model/gif';
import {AuthenticationService} from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class GifCardService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient,
              private authenticationService: AuthenticationService) { }

  public saveGif(username: string, gif: Gif): Observable<any> {
    return this.http.put(`${this.host}/api/gif/${username}`, gif);
  }

  public getAll(): Observable<Gif[]> {
    const currentUsername = this.authenticationService.getUserFromLocalCache().username;
    return this.http.get<Gif[]>(`${this.host}/api/gif/${currentUsername}`);
  }

  public tag(value: string, id: number): Observable<any> {
    const tagRequest = {
      gifId: id,
      name: value
    };
    return this.http.put(`${this.host}/api/gif/tag`, tagRequest);
  }
}
