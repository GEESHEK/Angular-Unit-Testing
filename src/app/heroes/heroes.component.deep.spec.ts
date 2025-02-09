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
        {provide: HeroService, useValue: mockHeroService},
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

  // collection of children
  // trigger the event on the child that the parent is listening to
  // trigger a delete method on the parent component
  it(`should call heroService.deleteHero when the Hero Component's
      delete button is clicked`, () => {
    //watch to see if this method is invoked
    spyOn(fixture.componentInstance, 'delete');
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    fixture.detectChanges();

    // component is actually a subclass of a directive
    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
    // trigger the underlying html element
    heroComponents[0].query(By.css('button'))
      .triggerEventHandler('click', {stopPropagation: () => {}})

    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
  });

  // have the child raise the delete event and not trigger it through clicking the HTML
  it(`should call heroService.deleteHero when the Hero Component's
      delete button is triggered through the component`, () => {
    //watch to see if this method is invoked
    spyOn(fixture.componentInstance, 'delete');
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    fixture.detectChanges();

    // component is actually a subclass of a directive
    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
    // (<HeroComponent>heroComponents[0].componentInstance).delete.emit(undefined);
    // (heroComponents[0].componentInstance).delete.emit(undefined);

    // debugElements have a triggerEventHandler
    // in this case we are testing less than the above methods
    // we don't even know if the child component actually has a delete event emitter
    // just telling the debugElement for the child component to raise the delete event
    heroComponents[0].triggerEventHandler('delete', null);

    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
  });
})
