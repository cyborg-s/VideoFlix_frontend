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

/**
 * Component for playing videos with custom controls and adaptive quality.
 */
@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player.html',
  styleUrls: ['./player.scss'],
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  /**
   * Reference to the video player container element.
   */
  @ViewChild('target', { static: true }) target!: ElementRef;

  /**
   * ID of the currently loaded video.
   */
  videoId!: number;

  /**
   * URL of the current video source, adapted to screen resolution.
   */
  videoUrl!: string;

  /**
   * Video metadata object loaded from the backend.
   */
  video: any;

  /**
   * Loading state indicator.
   */
  loading = true;

  /**
   * Video.js player instance.
   */
  player!: Player;

  /**
   * Subscription to route parameter changes.
   */
  private routeSub!: Subscription;

  /**
   * Subscription for periodic progress tracking.
   */
  private progressInterval!: Subscription;

  /**
   * Label describing current video quality (e.g., "1080p").
   */
  currentQualityLabel: string = '';

  /**
   * Title of the current video.
   */
  videoTitle: string = '';

  /**
   * Title string including resolution info for display.
   */
  titleWithResolution: string = '';

  /**
   * Generic title string.
   */
  title: string = '';

  /**
   * Handler for window resize events to toggle fullscreen.
   */
  private resizeHandler = () => this.toggleFullscreenOnLandscape();

  /**
   * Handler for device orientation change events to toggle fullscreen.
   */
  private orientationChangeHandler = () => this.toggleFullscreenOnLandscape();

  constructor(
    private route: ActivatedRoute,
    private videoService: VideoService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private location: Location
  ) {}

  /**
   * After view initialization, sets up back button click listener.
   */
  ngAfterViewInit() {
    const backBtn = this.target.nativeElement.querySelector('.back-button');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.goBack();
      });
    }
  }

  /**
   * On component initialization, subscribes to route params and loads video.
   */
  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      this.videoId = +params['id'];
      this.loadVideo();
    });
  }

  /**
   * On component destroy, cleans up subscriptions, event listeners, and disposes player.
   */
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

  /**
   * Loads video metadata by ID, sets resolution, initializes player and tracking.
   */
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

  /**
   * Sets the video URL and quality label based on current window width.
   */
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

  /**
   * Initializes the Video.js player with given start position and custom controls.
   * @param startAt The start time in seconds where playback should begin.
   */
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

  /**
   * Current toast message shown to the user.
   */
  toastMessage = '';

  /**
   * Boolean flag to show/hide toast notification.
   */
  showToastVisible = false;

  /**
   * Timeout ID for auto-hiding toast.
   */
  toastTimeout?: any;

  /**
   * Shows a toast notification with given message for 3 seconds.
   * @param message The message to display in the toast.
   */
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

  /**
   * Changes the video quality by switching source URL and updating player state.
   * @param url The new video source URL.
   * @param label The label of the new quality (e.g. "720p").
   */
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

  /**
   * Starts periodic saving of video playback progress every 5 seconds.
   */
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

  /**
   * Navigates back in browser history.
   */
  goBack() {
    this.location.back();
  }

  /**
   * Returns the resolution label based on current window width.
   * @returns The resolution label string like "1080p".
   */
  getResolutionLabel(): string {
    const width = window.innerWidth;
    if (width >= 1200) return '1080p';
    else if (width >= 900) return '720p';
    else if (width >= 600) return '360p';
    else return '180p';
  }

  /**
   * Updates the title string to include video title and current quality label.
   */
  private updateTitleWithResolution() {
    if (this.videoTitle && this.currentQualityLabel) {
      this.titleWithResolution = `${this.videoTitle} - ${this.currentQualityLabel}`;
    } else {
      this.titleWithResolution = '';
    }
  }

  /**
   * Checks if the device is a mobile device in landscape orientation.
   * @returns True if mobile device and landscape, otherwise false.
   */
  private isMobileLandscape(): boolean {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isLandscape = window.innerWidth > window.innerHeight;
    return isMobile && isLandscape;
  }

  /**
   * Toggles fullscreen style for the video player when in mobile landscape orientation.
   * Adjusts styles of the video container and control bar accordingly.
   */
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

      if (controlBar) {
        controlBar.style.width = '100%';
        controlBar.style.position = 'fixed';
        controlBar.style.bottom = '0';
        controlBar.style.left = '0';
      }
    } else {
      videoEl.style.position = '';
      videoEl.style.top = '';
      videoEl.style.left = '';
      videoEl.style.width = '';
      videoEl.style.height = '';
      videoEl.style.zIndex = '';

      if (controlBar) {
        controlBar.style.position = '';
        controlBar.style.bottom = '';
        controlBar.style.left = '';
        controlBar.style.width = '';
      }
    }
  }
}
