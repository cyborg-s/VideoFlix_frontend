import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChildren,
  ElementRef,
  QueryList,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VideoService } from '../services/video.service';

/**
 * Dashboard component that displays video categories and a hero video.
 * 
 * Supports horizontal draggable carousels of videos and handles user interactions
 * such as selecting a hero video or navigating to a video player.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private videoService = inject(VideoService);

  /** Array of video categories, each with a name and an array of movies */
  categories: { name: string; movies: any[] }[] = [];

  /** The currently selected hero video shown prominently */
  heroVideo: any = null;

  /** Flag indicating if the hero video's thumbnail has loaded */
  heroThumbnailLoaded = false;

  private isDown = false;
  private startX = 0;
  private scrollLeft = 0;

  /** Reference to the currently active carousel element during drag */
  private activeCarousel: HTMLElement | null = null;

  /** QueryList of carousel elements identified by the template reference 'carousel' */
  @ViewChildren('carousel') carouselsRef!: QueryList<ElementRef>;

  /**
   * OnInit lifecycle hook.
   * Loads video categories and continue-watching list from route data,
   * inserts "Weiterschauen" category if applicable,
   * sets the hero video to the newest video by id.
   */
  ngOnInit(): void {
    const data = this.route.snapshot.data;
    const categories = data['categories']?.categories || [];
    const continueList = data['categories']?.continueWatching || [];

    this.categories = categories;

    if (continueList.length > 0) {
      if (this.categories.length === 0) {
        this.categories.push({
          name: 'Weiterschauen',
          movies: continueList,
        });
      } else {
        this.categories.splice(1, 0, {
          name: 'Weiterschauen',
          movies: continueList,
        });
      }
    }

    const allVideos = this.categories.flatMap((c) => c.movies);
    const sorted = allVideos.sort((a, b) => b.id - a.id);

    this.heroVideo = sorted[0] || null;
    this.heroThumbnailLoaded = false;
  }

  /**
   * AfterViewInit lifecycle hook.
   * Subscribes to changes of the carousel QueryList and binds mouse drag events
   * to each carousel element for horizontal scrolling.
   */
  ngAfterViewInit(): void {
    this.carouselsRef.changes.subscribe(() => {
      this.bindCarouselEvents();
    });
    this.bindCarouselEvents();
  }

  /**
   * Binds mouse event listeners to each carousel element to enable
   * drag-to-scroll functionality.
   */
  private bindCarouselEvents() {
    this.carouselsRef.forEach((carouselRef) => {
      const el = carouselRef.nativeElement as HTMLElement;

      el.addEventListener('mousedown', (e: MouseEvent) => {
        this.isDown = true;
        this.activeCarousel = el;
        this.activeCarousel.classList.add('active');
        this.startX = e.pageX - this.activeCarousel.offsetLeft;
        this.scrollLeft = this.activeCarousel.scrollLeft;
      });

      el.addEventListener('mouseleave', () => {
        if (this.activeCarousel) this.activeCarousel.classList.remove('active');
        this.isDown = false;
      });

      el.addEventListener('mouseup', () => {
        if (this.activeCarousel) this.activeCarousel.classList.remove('active');
        this.isDown = false;
      });

      el.addEventListener('mousemove', (e: MouseEvent) => {
        if (!this.isDown || !this.activeCarousel) return;
        e.preventDefault();
        const x = e.pageX - this.activeCarousel.offsetLeft;
        const walk = (x - this.startX) * 2; // Scroll speed factor
        this.activeCarousel.scrollLeft = this.scrollLeft - walk;
      });
    });
  }

  /**
   * Handles user clicking on a movie thumbnail.
   * On mobile, navigates to the video player route.
   * On desktop, sets the clicked movie as the hero video.
   * @param movie The movie object clicked
   * @param event Mouse event of the click
   */
  onMovieClick(movie: any, event: MouseEvent) {
    const isMobile = window.innerWidth <= 720;

    if (isMobile) {
      this.router.navigate(['/video', movie.id]);
    } else {
      this.heroVideo = movie;
      this.heroThumbnailLoaded = false;
    }
  }

  /**
   * Called when the hero video's thumbnail image has loaded.
   * Sets a flag to true for UI updates.
   */
  onHeroThumbnailLoad() {
    this.heroThumbnailLoaded = true;
  }

  /**
   * Starts playback of the hero video.
   * Navigates to the player route, optionally resuming from last position.
   * @param resume Whether to resume playback from last known position
   */
  onPlayHeroVideo(resume: boolean) {
    if (!this.heroVideo || !this.heroVideo.id) {
      console.warn('Kein Video zum Abspielen ausgewählt');
      return;
    }

    const startPosition = resume ? this.heroVideo.position_in_seconds || 0 : 0;

    this.router.navigate(['/player', this.heroVideo.id], {
      queryParams: { position: startPosition },
    });
  }

  /**
   * Returns CSS style object for the hero video's background image with overlay gradient.
   * @returns Style object for Angular binding
   */
  getHeroStyle() {
    return {
      'background-image': `linear-gradient(180deg, rgba(20,20,20,0.6) 0%, rgba(20,20,20,0) 50%, #141414 100%), url(${this.heroVideo.img})`,
      'background-size': 'cover',
      'background-position': 'center',
      'background-repeat': 'no-repeat',
    };
  }
}
