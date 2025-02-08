import {ComponentFixture, TestBed} from "@angular/core/testing";
import {HeroesComponent} from "./heroes.component";
import {HeroService} from "../hero.service";
import {Component, EventEmitter, Input, NO_ERRORS_SCHEMA, Output} from "@angular/core";
import {of} from "rxjs";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MessageService} from "../message.service";
import {Hero} from "../hero";

describe('HeroesComponent (shallow tests', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES;

  //creating a mock child instead of ignoring the template errors with NO_ERRORS_SCHEMA
  @Component({
    selector: "app-hero",
    template: "<div></div>",
  })
  class FakeHeroComponent {
    @Input() hero: Hero;
    @Output() delete = new EventEmitter();
  }

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
        FakeHeroComponent,
      ],
      //provide services for injection but we should mock
      providers: [
        { provide: HeroService, useValue: mockHeroService },
      ],
      imports: [HttpClientTestingModule],
      // used to ignore the child component > errors in templates ignored
      // schemas: [NO_ERRORS_SCHEMA]
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
