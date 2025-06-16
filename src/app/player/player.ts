import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VideoService } from '../services/video.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player.html',
  styleUrls: ['./player.scss']
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  videoId!: number;
  videoUrl!: SafeResourceUrl;
  video: any;
  loading = true;

  private routeSub!: Subscription;
  private progressInterval!: Subscription;

  constructor(
    private videoService: VideoService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.videoId = +params['id'];
      this.loadVideo();
    });
  }
  

  ngOnDestroy() {
    this.routeSub?.unsubscribe();
    this.progressInterval?.unsubscribe(); // Fortschrittstracking stoppen
  }

  private loadVideo() {
  this.loading = true;
  this.videoService.getVideoById(this.videoId).subscribe(video => {
    this.ngZone.run(() => {
      this.video = video;
      this.setVideoResolution();
      this.loading = false;
      this.cdr.detectChanges();

      // Nach Setzen der Video-URL kurz warten, damit Video-Element da ist
      setTimeout(() => {
        console.log(this.video.last_position)
        this.startVideoAt(this.video.last_position || 0);
        this.startProgressTracking();
      }, 1000);
    });
  });
}

startVideoAt(seconds: number) {
  const videoElement = document.querySelector('video');
  if (videoElement) {
    (videoElement as HTMLVideoElement).currentTime = seconds;
    videoElement.play();
  }
}

  private setVideoResolution() {
    if (!this.video) return;

    const width = window.innerWidth;
    let resolution = 'video_180p';
    if (width >= 1200) {
      resolution = 'video_1080p';
    } else if (width >= 900) {
      resolution = 'video_720p';
    } else if (width >= 600) {
      resolution = 'video_360p';
    }

    const rawUrl = this.video[resolution];
    if (rawUrl) {
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
      this.cdr.detectChanges();
    }
  }

  private startProgressTracking() {
    const videoElement = document.querySelector('video');
    if (!videoElement) return;

    this.progressInterval = interval(5000).subscribe(() => {
      const position = (videoElement as HTMLVideoElement).currentTime;
      this.videoService.saveProgress(this.videoId, position).subscribe();
    });
  }
}
