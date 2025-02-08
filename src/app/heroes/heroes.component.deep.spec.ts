import {ComponentFixture, TestBed} from "@angular/core/testing";
import {HeroesComponent} from "./heroes.component";
import {HeroService} from "../hero.service";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {of} from "rxjs";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {By} from "@angular/platform-browser";
import {HeroComponent} from "../hero/hero.component";

describe('HeroesComponent (deep tests', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES;

  beforeEach(() => {
    HEROES = [
      {id: 1, name: 'h1', strength: 8},
      {id: 2, name: 'h2', strength: 24},
      {id: 3, name: 'h3', strength: 55}
    ]
    mockHeroService = jasmine.createSpyObj(["getHeroes", 'addHeroes', 'deleteHeroes']);

    TestBed.configureTestingModule({
      declarations: [
        HeroesComponent,
        HeroComponent
      ],
      providers: [
        { provide: HeroService, useValue: mockHeroService },
      ],
      imports: [HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
    fixture = TestBed.createComponent(HeroesComponent);
  });

  it('should render each hero as a HeroComponent', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    // detectChanges called on the parent will trigger child components as well
    // run ngOnInit
    fixture.detectChanges();

    // find child elements
    const heroComponentsDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
    expect(heroComponentsDEs.length).toEqual(3);
    for (let i = 0; i < heroComponentsDEs.length; i++) {
      expect(heroComponentsDEs[i].componentInstance.hero).toEqual(HEROES[i]);
    }
  });
})
