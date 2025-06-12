import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit, AfterViewInit {
  categories: { name: string; movies: any[] }[] = [];
  heroVideo: any = null;

  private isDown = false;
  private startX = 0;
  private scrollLeft = 0;
  private activeCarousel: HTMLElement | null = null;

  constructor(private http: HttpClient, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:8000/api/videoflix/videos/').subscribe({
      next: (videos) => {
        if (!videos || videos.length === 0) return;

        const sortedVideos = [...videos].sort(
          (a, b) =>
            new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime()
        );

        this.heroVideo = sortedVideos[0];

        const newOnVideoflix = {
          name: 'New on Videoflix',
          movies: sortedVideos.slice(0, 10).map((video) => ({
            title: video.title,
            img: video.thumbnail,
            description: video.description,
          })),
        };

        const grouped: { [genre: string]: any[] } = {};
        for (const video of videos) {
          if (!grouped[video.genre]) grouped[video.genre] = [];
          grouped[video.genre].push({
            title: video.title,
            img: video.thumbnail,
            description: video.description,
          });
        }

        const genreCategories = Object.entries(grouped).map(([genre, movies]) => ({
          name: this.capitalizeFirstLetter(genre),
          movies,
        }));

        this.categories = [newOnVideoflix, ...genreCategories];
      },
      error: (err) => {
        console.error('Fehler beim Laden der Videos:', err);
      },
    });
  }

  ngAfterViewInit(): void {
    const carousels = document.querySelectorAll('.carousel');

    carousels.forEach((carousel) => {
      const el = carousel as HTMLElement;

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
    console.log('Video angeklickt:', movie.title);
  }

  private capitalizeFirstLetter(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
}
