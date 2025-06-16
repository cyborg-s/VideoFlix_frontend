// src/app/services/video.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VideoService {
  private apiUrl = 'http://localhost:8000/api/videoflix/';

  constructor(private http: HttpClient) {}

  getCategories(): Observable<{ name: string; movies: any[] }[]> {
    return this.http.get<any[]>(`${this.apiUrl}videos/`).pipe(
      map((videos) => {
        if (!videos || videos.length === 0) return [];

        const sortedVideos = [...videos].sort(
          (a, b) =>
            new Date(b.upload_date).getTime() -
            new Date(a.upload_date).getTime()
        );

        const newOnVideoflix = {
          name: 'New on Videoflix',
          movies: sortedVideos.slice(0, 10).map((video) => ({
            id: video.id, // <--- HIER ergänzt
            title: video.title,
            img: video.thumbnail,
            description: video.description,
          })),
        };

        const grouped: { [genre: string]: any[] } = {};
        for (const video of videos) {
          if (!grouped[video.genre]) grouped[video.genre] = [];
          grouped[video.genre].push({
            id: video.id, // <--- HIER ergänzt
            title: video.title,
            img: video.thumbnail,
            description: video.description,
          });
        }

        const genreCategories = Object.entries(grouped).map(
          ([genre, movies]) => ({
            name: genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase(),
            movies,
          })
        );

        return [newOnVideoflix, ...genreCategories];
      })
    );
  }

  getVideoById(id: number): Observable<any> {
  return this.http.get(`${this.apiUrl}video/${id}/`);
}

getContinueWatching(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}video/continue/`);
}

saveProgress(videoId: number, position: number): Observable<any> {
  return this.http.post(`${this.apiUrl}video/progress/`, {
    "video_id": videoId,
    "position_in_seconds": position
  });
}

}
