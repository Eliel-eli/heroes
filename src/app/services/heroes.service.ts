import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Hero } from './../models/heroe.model';

@Injectable({
  providedIn: 'root',
})
export class HeroesService {
  private baseUrl = 'http://localhost:3000/heroes';

  constructor(private http: HttpClient) {}

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.baseUrl);
  }

  getHeroById(id: number): Observable<Hero | undefined> {
    return this.http
      .get<Hero[]>(`${this.baseUrl}?id=${id}`)
      .pipe(map((heroes) => (heroes.length > 0 ? heroes[0] : undefined)));
  }

  getHeroesByNameSubstring(substring: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.baseUrl}?name_like=${substring}`);
  }

  updateHero(updatedHero: Hero): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/${updatedHero.id}`,
      updatedHero
    );
  }

  deleteHero(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  addHero(newHero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.baseUrl, newHero);
  }
}
