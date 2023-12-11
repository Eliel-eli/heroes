import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  NO_ERRORS_SCHEMA,
  OnInit,
  ViewChild,
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Hero } from '../../models/heroe.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HeroesService } from './../../services/heroes.service';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-heroes',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatListModule,
    MatPaginatorModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.scss',
})
export class HeroesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  heroes: Hero[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  selectedHeroName: string = '';
  heroForm!: FormGroup;
  editingHero: Hero | null = null;
  newHero: { name: string } = { name: '' };

  displayedColumns: string[] = ['id', 'name']; // Define tus columnas según tus necesidades
  dataSource: MatTableDataSource<Hero>;

  selectedHero: Hero = { id: null, name: '' };
  filterKeyword: string = '';

  constructor(private heroesService: HeroesService, private fb: FormBuilder) {
    this.dataSource = new MatTableDataSource<Hero>([]);
  }

  ngOnInit(): void {
    this.heroesService.getHeroes().subscribe((heroes) => {
      this.dataSource.data = heroes;
    });
  }

  initHeroForm(): void {
    this.heroForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  loadHeroes(): void {
    this.heroesService.getHeroes().subscribe((heroes) => {
      this.dataSource.data = heroes;
    });
  }
  addHero(): void {
    this.initHeroForm();
    this.editingHero = null;
  }

  saveHero(): void {
    if (this.heroForm.valid) {
      const newHero: Hero = this.heroForm.value;
      if (this.editingHero) {
        this.heroesService.updateHero(newHero);
        this.editingHero = null;
      } else {
        this.heroesService.addHero(newHero);
      }
      this.loadHeroes();
    }
  }

  editHero(hero: Hero): void {
    this.editingHero = { ...hero };
    this.heroForm.setValue({
      id: this.editingHero.id,
      name: this.editingHero.name,
    });
  }
  deleteHero(id: number | null | undefined): void {
    // Asignar un valor por defecto de null si id es undefined
    const actualId: number | null = id === undefined ? null : id;

    if (actualId === null) {
      console.error('El id es null, no se puede borrar el héroe.');
      return;
    }

    const isConfirmed = window.confirm(
      '¿Estás seguro que deseas borrar este héroe?'
    );

    if (isConfirmed) {
      this.heroesService.deleteHero(actualId);
      this.loadHeroes();
      if (this.editingHero && this.editingHero.id === actualId) {
        this.editingHero = null;
        this.initHeroForm();
      }
    }
  }

  filterHeroes(): Hero[] {
    return this.dataSource.data.filter((hero) =>
      hero.name.toLowerCase().includes(this.selectedHeroName.toLowerCase())
    );
  }
  updateFilteredHeroes(): void {
    const filteredHeroes = this.filterHeroes();
    this.dataSource.data = filteredHeroes;
  }
}
