import {ComponentFixture, TestBed} from "@angular/core/testing";
import {HeroesComponent} from "./heroes.component";
import {HeroService} from "../hero.service";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {of} from "rxjs";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MessageService} from "../message.service";

describe('HeroesComponent (shallow tests', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  // let mockMessageService;
  let HEROES;

  beforeEach(() => {
    HEROES = [
      {id: 1, name: 'h1', strength: 8},
      {id: 2, name: 'h2', strength: 24},
      {id: 3, name: 'h3', strength: 55}
    ]
    mockHeroService = jasmine.createSpyObj(["getHeroes", 'addHeroes', 'deleteHeroes']);
    // mockMessageService = jasmine.createSpyObj(["add", "clear"]);

    TestBed.configureTestingModule({
      declarations: [HeroesComponent],
      //provide services for injection but we should mock
      providers: [
        { provide: HeroService, useValue: mockHeroService },
        // { provide: MessageService, useClass: mockMessageService }
      ],
      imports: [HttpClientTestingModule],
      // used to ignore the child component
      schemas: [NO_ERRORS_SCHEMA]
    })
    fixture = TestBed.createComponent(HeroesComponent);
  });

  it('should set heroes correctly form the service', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    // fire change detection in order for the lifecycle event > ngOnInIt to fire
    fixture.detectChanges();

    expect(fixture.componentInstance.heroes.length).toBe(3);
  });
})
