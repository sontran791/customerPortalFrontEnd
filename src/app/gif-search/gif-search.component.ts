import {Component, OnDestroy, OnInit} from '@angular/core';
import {GifService} from '../service/gif.service';
import {Subscription} from 'rxjs';
import {Gif, GifSearchResponse} from '../model/gif';
import {PageEvent} from '@angular/material/paginator';
import {NotificationService} from '../service/notification.service';
import {NotificationType} from '../enum/notification-type.enum';

@Component({
  selector: 'app-gif-search',
  templateUrl: './gif-search.component.html',
  styleUrls: ['./gif-search.component.css']
})
export class GifSearchComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  DEFAULT_SEARCH = 'Dog';
   searchText: string = this.DEFAULT_SEARCH;
   gifs: Gif[];
   searchResponse: GifSearchResponse = {
    count: 0,
    gifs: [],
    offset: 0,
    totalCount: 0
  };
  private pageEvent: PageEvent;

  constructor(public gifService: GifService,
              private notificationService: NotificationService) { }

  private search(): void {
    let offset = 0;
    let pageSize = this.gifService.pageSize;
    if (this.pageEvent) {
      pageSize = this.pageEvent.pageSize;
      offset = pageSize * this.pageEvent.pageIndex;
    }

    this.subscriptions.push(
      this.gifService.findGif(this.searchText, pageSize, offset).subscribe(
        res => {
          this.gifs = res.gifs;
          this.searchResponse = res;
        },
        error => {
          this.sendNotification(NotificationType.ERROR, 'Unable to pull data. Please try again');
          console.error(error);
        }
      )
    );
  }

  public onKey(event: any): void {
    this.searchText = event.target.value;
    this.search();
  }

  public onPageEvent(event: PageEvent): void {
    this.pageEvent = event;
    this.search();
    window.scrollTo(0, 0);
  }

  ngOnInit(): void {
    this.search();
  }

  private sendNotification(notificationType: NotificationType, message: string): void {
    if (message) {
      this.notificationService.notify(notificationType, message);
    } else {
      this.notificationService.notify(notificationType, 'An error occurred. Please try again.');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
