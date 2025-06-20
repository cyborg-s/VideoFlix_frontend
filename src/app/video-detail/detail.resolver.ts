/**
 * Resolver to fetch video details before navigating to the video detail route.
 * 
 * Implements Angular's Resolve interface to retrieve video data by ID from the
 * VideoService. Returns an observable with the video data or null if no ID is present.
 */

import { Injectable } from '@angular/core'; 
import {
  Resolve,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { VideoService } from '../services/video.service';

@Injectable({ providedIn: 'root' })
export class VideoDetailResolver implements Resolve<any> {
  constructor(private videoService: VideoService) {}

  /**
   * Resolves video data based on the 'id' route parameter.
   * @param route The current activated route snapshot containing route parameters.
   * @returns An Observable that emits the video data or null if 'id' param is missing.
   */
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const idString = route.paramMap.get('id');
    if (!idString) {
      return of(null);
    }
    const id = +idString;
    return this.videoService.getVideoById(id);
  }
}
