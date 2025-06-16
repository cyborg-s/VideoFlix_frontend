import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChildren,
  ElementRef,
  QueryList,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { VideoService } from '../services/video.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private videoService = inject(VideoService);

  categories: { name: string; movies: any[] }[] = [];
  heroVideo: any = null;
  heroThumbnailLoaded = false;

  private isDown = false;
  private startX = 0;
  private scrollLeft = 0;
  private activeCarousel: HTMLElement | null = null;

  @ViewChildren('carousel') carouselsRef!: QueryList<ElementRef>;

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



  ngAfterViewInit(): void {
    this.carouselsRef.changes.subscribe(() => {
      this.bindCarouselEvents();
    });
    this.bindCarouselEvents();
  }

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
        const walk = (x - this.startX) * 2;
        this.activeCarousel.scrollLeft = this.scrollLeft - walk;
      });
    });
  }

onMovieClick(movie: any, event: MouseEvent) {
  const isMobile = window.innerWidth <= 720;

  if (isMobile) {
    this.router.navigate(['/video', movie.id]);
  } else {
    this.heroVideo = movie;
    this.heroThumbnailLoaded = false;
  }
}

  onHeroThumbnailLoad() {
    this.heroThumbnailLoaded = true;
  }

  onPlayHeroVideo() {
    if (!this.heroVideo || !this.heroVideo.id) {
      console.warn('Kein Video zum Abspielen ausgewählt');
      return;
    }
    this.router.navigate(['/player', this.heroVideo.id], {
      queryParams: { position: this.heroVideo.position_in_seconds || 0 }
    });
  }

  getHeroStyle() {
  return {
    'background-image': `linear-gradient(180deg, rgba(20,20,20,0.6) 0%, rgba(20,20,20,0) 50%, #141414 100%), url(${this.heroVideo.img})`,
    'background-size': 'cover',
    'background-position': 'center',
    'background-repeat': 'no-repeat'
  };
}

}
