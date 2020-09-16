import {Component, OnDestroy, OnInit} from '@angular/core';
import {Gif} from '../model/gif';
import {GifCardService} from '../service/gif-card.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-gif-profile',
  templateUrl: './gif-profile.component.html',
  styleUrls: ['./gif-profile.component.css']
})
export class GifProfileComponent implements OnInit, OnDestroy {

   gifs: Gif[];
  private subscriptions: Subscription[] = [];

  constructor(private gifCardService: GifCardService) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.gifCardService.getAll().subscribe(
        (res) => this.gifs = res
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
