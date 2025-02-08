import {TestBed} from "@angular/core/testing"
import {HeroService} from "./hero.service";
import {MessageService} from "./message.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

describe('HeroService', () => {
  let mockMessageService;
  let httpTestingController: HttpTestingController;
  let service: HeroService;

  beforeEach(() => {
    mockMessageService = jasmine.createSpyObj(['add']);

    TestBed.configureTestingModule({
      // ensures HTTP requests are mocked and controlled, allowing you to test your service without making real API calls.
      imports: [HttpClientTestingModule],
      providers: [
        HeroService,
        {provide: MessageService, useValue: mockMessageService}
      ]
    })
    // gets a handle to the services with inject
    // lets you intercept, verify, and respond to the HTTP requests that are made within the test.
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(HeroService);
  })

  describe('getHero', () => {
    it('should call get with the correct URL', () => {
      // call getHero()
      // service.getHero(4).subscribe(hero => {
      //   expect(hero.id).toEqual(4);
      // });
      service.getHero(4).subscribe();

      // test that the URL was correct
      const req = httpTestingController.expectOne('api/heroes/4');

      req.flush({id: 4, name: 'h1', strength: 100});
      // expect(req.request.method).toEqual('GET');
      httpTestingController.verify();
    })
  })


  // another way to retrieve the services but looks a bit messy and complex
  // describe('getHero', () => {
  //   it('should call get with the correct URL', inject(
  //     [HeroService, HttpTestingController],
  //     (service: HeroService, controller: HttpTestingController) => {
  //     // call getHero()
  //     service.getHero(4);
  //
  //     // test that the URL was correct
  //   }))
  // })
})
