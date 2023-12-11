import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HeroesComponent } from './heroes.component';
import { HeroesService } from './../../services/heroes.service';
import { of } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;
  let heroesServiceSpy: jasmine.SpyObj<HeroesService>;
  let heroesService: HeroesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
      ],
      providers: [HeroesService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroesComponent);
    component = fixture.componentInstance;
    heroesService = TestBed.inject(HeroesService);
    spyOn(heroesService, 'getHeroes').and.returnValue(
      of([{ id: 1, name: 'Superman' }])
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load heroes on init', () => {
    const heroes = [
      { id: 1, name: 'Spiderman' },
      { id: 2, name: 'Batman' },
    ];
    heroesServiceSpy.getHeroes.and.returnValue(of(heroes));

    component.ngOnInit();

    expect(component.dataSource.data).toEqual(heroes);
  });

  it('should add a hero', () => {
    const newHero = { name: 'Iron Man' };
    const expectedHeroes = [
      { id: 1, name: 'Spiderman' },
      { id: 2, name: 'Batman' },
      { id: null, name: 'Iron Man' },
    ];
    heroesServiceSpy.getHeroes.and.returnValue(of(expectedHeroes));

    component.addHero();

    expect(component.dataSource.data).toEqual(expectedHeroes);
  });

  it('should save a hero', () => {
    const existingHero = { id: 1, name: 'Spiderman' };
    const updatedHero = { ...existingHero, name: 'Spider-Man' };

    component.editingHero = existingHero;
    component.heroForm.setValue({ id: existingHero.id, name: 'Spider-Man' });
    heroesServiceSpy.updateHero.and.returnValue(of(undefined));

    component.saveHero();

    expect(heroesServiceSpy.updateHero).toHaveBeenCalledWith(updatedHero);
    expect(component.editingHero).toBeNull();
    expect(component.heroForm.value).toEqual({ id: null, name: '' });
  });

  it('should delete a hero', () => {
    const heroId = 1;
    const expectedHeroes = [{ id: 2, name: 'Batman' }];
    heroesServiceSpy.getHeroes.and.returnValue(of(expectedHeroes));

    component.deleteHero(heroId);

    expect(heroesServiceSpy.deleteHero).toHaveBeenCalledWith(heroId);
    expect(component.dataSource.data).toEqual(expectedHeroes);
  });

  it('should filter heroes', () => {
    // Asigna valores al dataSource.data antes de llamar a updateFilteredHeroes
    component.dataSource.data = [
      { id: 1, name: 'Superman' },
      { id: 2, name: 'Batman' },
      { id: 3, name: 'Iron Man' },
    ];

    // Asigna el valor esperado antes de llamar a updateFilteredHeroes
    component.selectedHeroName = 'Iron';

    // Llama a updateFilteredHeroes
    component.updateFilteredHeroes();

    // Verifica las expectativas después de aplicar el filtrado
    expect(component.dataSource.data.length).toEqual(1);
    expect(component.dataSource.data[0].id).toEqual(3);
    expect(component.dataSource.data[0].name).toEqual('Iron Man');
  });

  it('should update filtered heroes', () => {
    const heroes = [
      { id: 1, name: 'Spiderman' },
      { id: 2, name: 'Batman' },
      { id: 3, name: 'Iron Man' },
    ];
    component.dataSource.data = heroes;

    component.updateFilteredHeroes();

    expect(component.dataSource.data).toEqual(heroes);
  });
});
