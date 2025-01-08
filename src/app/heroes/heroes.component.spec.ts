import {HeroesComponent} from "./heroes.component";
import {of} from "rxjs";

describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let HEROES;
  let mockHeroesService;

  beforeEach(() => {
    HEROES = [
      {id: 1, name: 'h1', strenght: 8},
      {id: 2, name: 'h2', strenght: 24},
      {id: 3, name: 'h3', strenght: 55}
    ]

    mockHeroesService = jasmine.createSpyObj('HeroesService', ['getHeroes', 'addHero', 'deleteHero']);

    component = new HeroesComponent(mockHeroesService);
  })

  describe('delete', () => {

    // State based test
    it('should remove the indicated hero from the heroes list', () => {
      //just returning an observable from the subscribe method
      mockHeroesService.deleteHero.and.returnValue(of(true));
      component.heroes = HEROES;

      component.delete(HEROES[2]);

      expect(component.heroes.length).toBe(2);
    })


    // Testing interactions
    it('should call deleteHero', () => {
      mockHeroesService.deleteHero.and.returnValue(of(true));
      component.heroes = HEROES;

      component.delete(HEROES[2]);

      expect(mockHeroesService.deleteHero).toHaveBeenCalledWith(HEROES[2]);
    })
  })
})

