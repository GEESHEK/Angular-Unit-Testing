import {ComponentFixture, TestBed} from "@angular/core/testing";
import {HeroesComponent} from "./heroes.component";
import {HeroService} from "../hero.service";
import {Directive, Input} from "@angular/core";
import {of} from "rxjs";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {By} from "@angular/platform-browser";
import {HeroComponent} from "../hero/hero.component";

@Directive({
  selector: '[routerLink]',
  host: { '(click)': 'onClick()'},
})
export class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigateTo: any = null;

  onClick() {
    this.navigateTo = this.linkParams;
  }
}

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
    mockHeroService = jasmine.createSpyObj(["getHeroes", 'addHero', 'deleteHero']);

    TestBed.configureTestingModule({
      declarations: [
        HeroesComponent,
        HeroComponent,
        RouterLinkDirectiveStub
      ],
      providers: [
        {provide: HeroService, useValue: mockHeroService},
      ],
      imports: [HttpClientTestingModule],
      // schemas: [NO_ERRORS_SCHEMA]
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

  it('should add a new hero to the hero list when the add button is clicked', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    fixture.detectChanges();
    const name = "h4";
    mockHeroService.addHero.and.returnValue(of({id: 5, name: 'h4', strength: 4}));
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    const addButton = fixture.debugElement.queryAll(By.css('button'))[0];

    // same as typing the name into the input box
    inputElement.value = name;
    addButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    // const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;
    // expect(heroText).toContain(name);

    const heroText1 = fixture.debugElement.queryAll(By.css('app-hero'))[3].nativeElement.textContent;
    expect(heroText1).toContain(name);
    // expect(HEROES.length).toEqual(4);
  });

  it('should have the correct route for the first hero', () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();
    const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

    let routerLink = heroComponents[0]
      .query(By.directive(RouterLinkDirectiveStub))
      .injector.get(RouterLinkDirectiveStub);

    heroComponents[0].query(By.css('a')).triggerEventHandler('click', null);

    expect(routerLink.navigateTo).toBe('/detail/1');
  });
})
