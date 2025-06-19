import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-detail.html',
  styleUrls: ['./video-detail.scss']
})
export class VideoDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  video: any;  // Optional: kannst du auch typisieren

  ngOnInit() {
    this.video = this.route.snapshot.data['video'];
    console.log('Resolved video:', this.video);

    if (!this.video) {
      // Optional: Wenn kein Video geladen, zurück zur Übersicht
      this.router.navigate(['/dashboard']);
    }
  }

  playVideo() {
    this.router.navigate(['/player', this.video.id], {
      queryParams: { position: this.video.position_in_seconds || 0 }
    });
  }

  getHeroStyle() {
    return {
      'background-image': `linear-gradient(180deg, rgba(20, 20, 20, 0.6) 0%, rgba(20, 20, 20, 0) 50%, #141414 100%), url(${this.video?.thumbnail})`,
      'background-size': 'cover',
      'background-position': 'center',
      'background-repeat': 'no-repeat'
    };
  }
}

