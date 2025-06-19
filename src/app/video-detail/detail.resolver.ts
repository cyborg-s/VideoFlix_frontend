import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { VideoService } from '../services/video.service';

@Injectable({ providedIn: 'root' })
export class VideoDetailResolver implements Resolve<any> {
  constructor(private videoService: VideoService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const idString = route.paramMap.get('id');
    if (!idString) {
      return of(null);
    }
    const id = +idString;
    return this.videoService.getVideoById(id);
  }
}
