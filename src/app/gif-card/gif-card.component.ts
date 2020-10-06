import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {GifCardService} from '../service/gif-card.service';
import {Gif} from '../model/gif';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';
import {AuthenticationService} from '../service/authentication.service';
import {Subscription} from 'rxjs';
import {NotificationService} from '../service/notification.service';
import {NotificationType} from '../enum/notification-type.enum';

@Component({
  selector: 'app-gif-card',
  templateUrl: './gif-card.component.html',
  styleUrls: ['./gif-card.component.css']
})
export class GifCardComponent implements OnInit, OnDestroy {
  private MAX_TITLE_LENGTH = 20;
  mGif: Gif;
  titleFormatted: string;
  isFavorite = false;
  favoriteButtonText = 'Favorite';
  private subscriptions: Subscription[] = [];

  constructor(private gifCardService: GifCardService,
              private domSanitizer: DomSanitizer,
              private authenticationService: AuthenticationService,
              private notificationService: NotificationService) { }

  ngOnInit(): void {
  }

  @Input()
  set gif(gif: Gif) {
    this.mGif = gif;
    if (this.mGif.title.length > this.MAX_TITLE_LENGTH) {
      this.titleFormatted = this.mGif.title.substr(0, this.MAX_TITLE_LENGTH) + '...';
    } else {
      this.titleFormatted = this.mGif.title;
    }
    console.log(gif);
  }

  save(): void {
    this.subscriptions.push(
      this.gifCardService.saveGif(this.authenticationService.getUserFromLocalCache().username,
        this.mGif).subscribe(
        () => {
          this.isFavorite = true;
          this.favoriteButtonText = 'Saved';
        },
        (error) => {
          console.log(error);
        }
      )
    );
  }

  styleSanitizer(url: string): SafeStyle {
    return this.domSanitizer.bypassSecurityTrustStyle('url(' + url + ')');
  }

   tag(value: string): void {
    this.subscriptions.push(
      this.gifCardService.tag(value, this.mGif.gifId).subscribe(
        () => {
          this.mGif.tags.push({name: value});
          this.sendNotification(NotificationType.SUCCESS, `Added tag "${value.toUpperCase()}" successfully`);
        }
      )
    );
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
