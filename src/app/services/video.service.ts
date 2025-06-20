/**
 * Service for fetching and managing video data from the Videoflix API.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VideoService {
  private apiUrl = 'http://localhost:8000/api/videoflix/';

  constructor(private http: HttpClient) {}

  /**
   * Retrieves video categories including a "New on Videoflix" category
   * and other categories grouped by genre.
   * Each category contains an array of movies with id, title, thumbnail image, and description.
   *
   * @returns Observable emitting an array of categories with their movies.
   */
  getCategories(): Observable<{ name: string; movies: any[] }[]> {
    return this.http.get<any[]>(`${this.apiUrl}videos/`).pipe(
      map((videos) => {
        if (!videos || videos.length === 0) return [];


        const sortedVideos = [...videos].sort(
          (a, b) =>
            new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime()
        );

        const newOnVideoflix = {
          name: 'New on Videoflix',
          movies: sortedVideos.slice(0, 10).map((video) => ({
            id: video.id,
            title: video.title,
            img: video.thumbnail,
            description: video.description,
          })),
        };

        const grouped: { [genre: string]: any[] } = {};
        for (const video of videos) {
          if (!grouped[video.genre]) grouped[video.genre] = [];
          grouped[video.genre].push({
            id: video.id,
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

  /**
   * Retrieves detailed information for a specific video by ID.
   * 
   * @param id The ID of the video.
   * @returns Observable emitting the video details.
   */
  getVideoById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}video/${id}/`);
  }

  /**
   * Retrieves the list of videos the user has started watching and not finished.
   * 
   * @returns Observable emitting an array of videos for continue watching.
   */
  getContinueWatching(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}video/continue/`);
  }

  /**
   * Saves the user's current playback progress for a video.
   * 
   * @param videoId The ID of the video.
   * @param position The current playback position in seconds.
   * @returns Observable emitting the server response.
   */
  saveProgress(videoId: number, position: number): Observable<any> {
    return this.http.post(`${this.apiUrl}video/progress/`, {
      video_id: videoId,
      position_in_seconds: position,
    });
  }
}
