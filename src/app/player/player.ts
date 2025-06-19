import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import videojs from 'video.js';
import { Subscription, interval } from 'rxjs';
import { VideoService } from '../services/video.service';
import type Player from 'video.js/dist/types/player';
import {
  Forward10Button,
  VolumeUpButton,
  Backward10Button,
  CustomPlaybackRateButton,
  QualityMenuButton,
  CenteredControls,
  TitleDisplay,
} from './custom.button';

videojs.registerComponent('Forward10Button', Forward10Button);
videojs.registerComponent('Backward10Button', Backward10Button);
videojs.registerComponent('VolumeUpButton', VolumeUpButton);
videojs.registerComponent('CustomPlaybackRateButton', CustomPlaybackRateButton);
videojs.registerComponent('QualityMenuButton', QualityMenuButton);
videojs.registerComponent('TitleDisplay', TitleDisplay);
videojs.registerComponent('CenteredControls', CenteredControls);

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player.html',
  styleUrls: ['./player.scss'],
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('target', { static: true }) target!: ElementRef;

  videoId!: number;
  videoUrl!: string;
  video: any;
  loading = true;
  player!: Player;

  private routeSub!: Subscription;
  private progressInterval!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private videoService: VideoService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private location: Location
  ) {}

  currentQualityLabel: string = '';
  videoTitle: string = '';
  titleWithResolution: string = '';
  title: string = '';

  private resizeHandler = () => this.toggleFullscreenOnLandscape();
  private orientationChangeHandler = () => this.toggleFullscreenOnLandscape();

  ngAfterViewInit() {
    const backBtn = this.target.nativeElement.querySelector('.back-button');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.goBack();
      });
    }
  }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      this.videoId = +params['id'];
      this.loadVideo();
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.progressInterval?.unsubscribe();
    if (this.player) {
      this.player.dispose();
    }
    window.removeEventListener('resize', this.resizeHandler);
    window.removeEventListener(
      'orientationchange',
      this.orientationChangeHandler
    );
  }

  private loadVideo() {
    this.loading = true;
    this.videoService.getVideoById(this.videoId).subscribe((video) => {
      this.video = video;
      this.videoTitle = video.title || '';

      this.setVideoResolution();
      this.titleWithResolution = `Optimizing video for your screen ${this.currentQualityLabel}`;
      this.cdr.detectChanges();

      setTimeout(() => {
        this.titleWithResolution = '';
        this.cdr.detectChanges();
      }, 3000);

      setTimeout(() => {
        const urlPosition = this.route.snapshot.queryParamMap.get('position');
        const startPosition =
          urlPosition !== null ? +urlPosition : video.last_position || 0;

        this.initPlayer(startPosition);
        this.startProgressTracking();
        this.loading = false;
        this.cdr.detectChanges();
      }, 200);
    });
  }

  private setVideoResolution() {
    const width = window.innerWidth;
    if (width >= 1200) {
      this.currentQualityLabel = '1080p';
      this.videoUrl = this.video.video_1080p;
    } else if (width >= 900) {
      this.currentQualityLabel = '720p';
      this.videoUrl = this.video.video_720p;
    } else if (width >= 600) {
      this.currentQualityLabel = '360p';
      this.videoUrl = this.video.video_360p;
    } else {
      this.currentQualityLabel = '180p';
      this.videoUrl = this.video.video_180p;
    }
    this.updateTitleWithResolution();
  }

  private initPlayer(startAt: number) {
    if (!this.videoUrl || !this.target) return;

    if (this.player) {
      this.player.dispose();
    }

    this.player = videojs(this.target.nativeElement, {
      controls: true,

      preload: 'auto',
      fluid: true,
      pip: false,
      controlBar: {
        pictureInPictureToggle: false,
      },
      playbackRates: [0.5, 1, 1.25, 1.5, 2],
      sources: [
        {
          src: this.videoUrl,
          type: 'video/mp4',
        },
      ],
    });

    this.player.ready(() => {
      this.player.currentTime(startAt);

      const controlBar = this.player.getChild('controlBar');
      if (controlBar) {
        [
          'PlaybackRateMenuButton',
          'CustomPlaybackRateButton',
          'Backward10Button',
          'Forward10Button',
        ].forEach((name) => {
          const oldBtn = controlBar.getChild(name);
          if (oldBtn) controlBar.removeChild(oldBtn);
        });

        controlBar.addChild('Backward10Button', {}, 1);
        controlBar.addChild('Forward10Button', {}, 2);
        this.player.addChild(
          'CenteredControls',
          {},
          this.player.children().length
        );

        controlBar.addChild(
          'QualityMenuButton',
          {
            qualities: [
              { label: '1080p', url: this.video.video_1080p },
              { label: '720p', url: this.video.video_720p },
              { label: '360p', url: this.video.video_360p },
              { label: '180p', url: this.video.video_180p },
            ],
            currentResolution: this.getResolutionLabel(),
            onChange: (quality: { label: string; url: string }) => {
              this.changeQuality(quality.url, quality.label);
            },
          },
          controlBar.children().length - 3
        );

        controlBar.addChild(
          'CustomPlaybackRateButton',
          {},
          controlBar.children().length - 1
        );
        controlBar.addChild('TitleDisplay', { title: this.video.title }, 6);
      }

      this.player.playbackRate(1.0);
    });
  }

  toastMessage = '';
  showToastVisible = false;
  toastTimeout?: any;

  private showToast(message: string) {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    this.toastMessage = message;
    this.showToastVisible = true;
    this.cdr.detectChanges();

    this.toastTimeout = setTimeout(() => {
      this.showToastVisible = false;
      this.cdr.detectChanges();
      this.toastMessage = '';
    }, 3000);
  }

  private changeQuality(url: string, label: string) {
    if (!this.player) return;

    const currentTime = this.player.currentTime() || 0;
    const isPaused = this.player.paused();

    this.player.src({ src: url, type: 'video/mp4' });
    this.player.one('loadedmetadata', () => {
      this.player.currentTime(currentTime);
      if (!isPaused) {
        this.player.play();
      }
    });

    this.videoUrl = url;
    this.currentQualityLabel = label;
    this.updateTitleWithResolution();

    this.showToast(`Qualität geändert auf ${label}`);
  }

  private startProgressTracking() {
    if (this.progressInterval) {
      this.progressInterval.unsubscribe();
    }
    this.progressInterval = interval(5000).subscribe(() => {
      if (this.player && typeof this.player.currentTime === 'function') {
        const position = this.player.currentTime();
        if (typeof position === 'number') {
          this.videoService.saveProgress(this.videoId, position).subscribe();
        }
      }
    });
  }

  goBack() {
    this.location.back();
  }

  getResolutionLabel(): string {
    const width = window.innerWidth;
    if (width >= 1200) return '1080p';
    else if (width >= 900) return '720p';
    else if (width >= 600) return '360p';
    else return '180p';
  }

  private updateTitleWithResolution() {
    if (this.videoTitle && this.currentQualityLabel) {
      this.titleWithResolution = `${this.videoTitle} - ${this.currentQualityLabel}`;
    } else {
      this.titleWithResolution = '';
    }
  }

  private isMobileLandscape(): boolean {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isLandscape = window.innerWidth > window.innerHeight;
    return isMobile && isLandscape;
  }

  private toggleFullscreenOnLandscape() {
    if (!this.target) return;
    const videoEl: HTMLElement = this.target.nativeElement;

    const controlBar = videoEl.querySelector('.vjs-control-bar') as HTMLElement;

    if (this.isMobileLandscape()) {
      videoEl.style.position = 'fixed';
      videoEl.style.top = '0';
      videoEl.style.left = '0';
      videoEl.style.width = '100vw';
      videoEl.style.height = '100vh';
      videoEl.style.zIndex = '9999';
      videoEl.style.pointerEvents = 'auto';

      if (controlBar) {
        controlBar.style.position = 'absolute';
        controlBar.style.bottom = '0';
        controlBar.style.left = '0';
        controlBar.style.width = '100%';
        controlBar.style.zIndex = '10000';
        controlBar.style.background = 'rgba(0, 0, 0, 0.5)';
        controlBar.style.pointerEvents = 'auto';
      }
    } else {
      videoEl.style.position = '';
      videoEl.style.top = '';
      videoEl.style.left = '';
      videoEl.style.width = '';
      videoEl.style.height = '';
      videoEl.style.zIndex = '';
      videoEl.style.pointerEvents = '';

      if (controlBar) {
        controlBar.style.position = '';
        controlBar.style.bottom = '';
        controlBar.style.left = '';
        controlBar.style.width = '';
        controlBar.style.zIndex = '';
        controlBar.style.background = '';
        controlBar.style.pointerEvents = '';
      }
    }
  }
}
