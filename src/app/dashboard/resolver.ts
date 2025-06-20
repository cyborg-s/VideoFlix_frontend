import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { VideoService } from '../services/video.service';
import { Observable, forkJoin } from 'rxjs';

/**
 * Resolver function for the dashboard route.
 * 
 * Fetches video categories and continue-watching list in parallel before route activation.
 * Uses Angular dependency injection to get the VideoService instance.
 * 
 * @returns An Observable resolving to an object containing:
 *   - categories: the list of video categories
 *   - continueWatching: the list of videos to continue watching
 */
export const dashboardResolver: ResolveFn<any> = (): Observable<any> => {
  const videoService = inject(VideoService);
  return forkJoin({
    categories: videoService.getCategories(),
    continueWatching: videoService.getContinueWatching(),
  });
};
