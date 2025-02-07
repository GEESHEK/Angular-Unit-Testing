import {ComponentFixture, TestBed} from "@angular/core/testing";
import {HeroComponent} from "./hero.component";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {By} from "@angular/platform-browser";

describe('HeroesComponent (shallow tests', () => {
  // Fixture is a wrapper around the component and it;s template
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(() => {
    // Test bed: allows the testing of both the component and it's template run together
    TestBed.configureTestingModule({
      declarations: [HeroComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(HeroComponent);
  });

  it('should have the correct hero', () => {
    fixture.componentInstance.hero = { id: 1, name: 'h1', strength: 3};

    expect(fixture.componentInstance.hero.name).toEqual('h1');
  });

  // integration test, to test the actual template, check if something on the dom is correct
  it('should render the hero name in the an anchor tag', () => {
    fixture.componentInstance.hero = { id: 1, name: 'h1', strength: 3};
    // need to detect change before the html is updated
    fixture.detectChanges();

    // debugElement can access directives but in this example it doesn't matter weather we use debug ot native
    let deA = fixture.debugElement.query(By.css('a'));
    expect(deA.nativeElement.textContent).toContain('h1');

    // expect(fixture.nativeElement.querySelector('a').textContent).toContain('h1');
  })
});
