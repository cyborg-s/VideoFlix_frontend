/**
 * Component to display detailed information about a specific video.
 * 
 * Retrieves video data resolved by the route and provides functionality
 * to play the video and style the hero section with the video's thumbnail.
 */

import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-detail.html',
  styleUrls: ['./video-detail.scss'],
})
export class VideoDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  /** The video data resolved from the route */
  video: any;

  /**
   * Initializes the component and loads the resolved video data.
   * Redirects to dashboard if no video data is found.
   */
  ngOnInit() {
    this.video = this.route.snapshot.data['video'];
    console.log('Resolved video:', this.video);

    if (!this.video) {
      this.router.navigate(['/dashboard']);
    }
  }

  /**
   * Navigates to the video player route with the video ID and optional playback position.
   */
  playVideo() {
    this.router.navigate(['/player', this.video.id], {
      queryParams: { position: this.video.position_in_seconds || 0 },
    });
  }

  /**
   * Returns CSS style object for the hero section background using the video's thumbnail.
   * @returns An object containing CSS properties for background styling.
   */
  getHeroStyle() {
    return {
      'background-image': `linear-gradient(180deg, rgba(20, 20, 20, 0.6) 0%, rgba(20, 20, 20, 0) 50%, #141414 100%), url(${this.video?.thumbnail})`,
      'background-size': 'cover',
      'background-position': 'center',
      'background-repeat': 'no-repeat',
    };
  }
}
