// src/app/dashboard/dashboard.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { VideoService } from '../services/video.service';
import { Observable, forkJoin } from 'rxjs';

export const dashboardResolver: ResolveFn<any> = (): Observable<any> => {
  const videoService = inject(VideoService);
  return forkJoin({
    categories: videoService.getCategories(),
    continueWatching: videoService.getContinueWatching()
  });
};
