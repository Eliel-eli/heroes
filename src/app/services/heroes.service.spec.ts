import { TestBed, inject } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HeroesService } from './heroes.service';
import { Hero } from './../models/heroe.model';

describe('HeroesService', () => {
  let service: HeroesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HeroesService],
    });

    service = TestBed.inject(HeroesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve heroes from the API via GET', () => {
    const dummyHeroes: Hero[] = [
      { id: 1, name: 'Spiderman' },
      { id: 2, name: 'Superman' },
    ];

    service.getHeroes().subscribe((heroes) => {
      expect(heroes).toEqual(dummyHeroes);
    });

    const req = httpMock.expectOne('http://localhost:3000/heroes');
    expect(req.request.method).toBe('GET');
    req.flush(dummyHeroes);
  });

  it('should retrieve a hero by ID from the API via GET', () => {
    const heroId = 1;
    const dummyHero: Hero = { id: heroId, name: 'Spiderman' };

    service.getHeroById(heroId).subscribe((hero) => {
      expect(hero).toEqual(dummyHero);
    });

    const req = httpMock.expectOne(`http://localhost:3000/heroes?id=${heroId}`);
    expect(req.request.method).toBe('GET');
    req.flush([dummyHero]);
  });

  it('should retrieve heroes by name substring from the API via GET', () => {
    const substring = 'Man';
    const dummyHeroes: Hero[] = [
      { id: 3, name: 'Manolito el fuerte' },
      { id: 4, name: 'Wonder Woman' },
    ];

    service.getHeroesByNameSubstring(substring).subscribe((heroes) => {
      expect(heroes).toEqual(dummyHeroes);
    });

    const req = httpMock.expectOne(
      `http://localhost:3000/heroes?name_like=${substring}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(dummyHeroes);
  });

  it('should update a hero via PUT', () => {
    const updatedHero: Hero = { id: 1, name: 'Spiderman Updated' };

    service.updateHero(updatedHero).subscribe(() => {
      // Do something after the hero is updated
    });

    const req = httpMock.expectOne(
      `http://localhost:3000/heroes/${updatedHero.id}`
    );
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('should delete a hero via DELETE', () => {
    const heroId = 1;

    service.deleteHero(heroId).subscribe(() => {
      // Do something after the hero is deleted
    });

    const req = httpMock.expectOne(`http://localhost:3000/heroes/${heroId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should add a new hero via POST', () => {
    const newHero: Hero = { id: null, name: 'Black Panther' };

    service.addHero(newHero).subscribe((addedHero) => {
      expect(addedHero).toEqual(newHero);
    });

    const req = httpMock.expectOne('http://localhost:3000/heroes');
    expect(req.request.method).toBe('POST');
    req.flush(newHero);
  });
});
