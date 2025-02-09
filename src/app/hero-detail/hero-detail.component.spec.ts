import {ComponentFixture, fakeAsync, flush, TestBed} from "@angular/core/testing";
import {HeroDetailComponent} from "./hero-detail.component";
import {ActivatedRoute} from "@angular/router";
import {HeroService} from "../hero.service";
import {Location} from "@angular/common";
import {of} from "rxjs";
import {FormsModule} from "@angular/forms";

describe('HeroDetailComponent', () => {
    let fixture: ComponentFixture<HeroDetailComponent>;
    let mockActivatedRoute, mockHeroService, mockLocation;

    beforeEach(() => {
        mockActivatedRoute = {
            snapshot: {
                paramMap: {
                    get: () => {
                        return '3';
                    }
                }
            }
        }

        mockHeroService = jasmine.createSpyObj(["getHero", "updateHero"]);
        mockLocation = jasmine.createSpyObj(["back"]);

        TestBed.configureTestingModule({
            declarations: [HeroDetailComponent],
            imports: [FormsModule],
            providers: [
                {provide: ActivatedRoute, useValue: mockActivatedRoute},
                {provide: HeroService, useValue: mockHeroService},
                {provide: Location, useValue: mockLocation},
            ]
        });
        fixture = TestBed.createComponent(HeroDetailComponent);

        mockHeroService.getHero.and.returnValue(of({id: 3, name: "h3", strength: 100}));
    });

    it('should render hero name in a h2 tag', () => {
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('h2').textContent).toContain('H3');
    });

    //async test, wrap call back in fakeAsync
    //treat async as synchronous (works for promises as well)
    it('should call updateHero when save is called', fakeAsync(() => {
        mockHeroService.updateHero.and.returnValue(of({}));
        fixture.detectChanges();

        fixture.componentInstance.save();
        flush();

        expect(mockHeroService.updateHero).toHaveBeenCalled();
    }));

    //promise test
    // it('should call updateHero when save is called', waitForAsync(() => {
    //     mockHeroService.updateHero.and.returnValue(of({}));
    //     fixture.detectChanges();
    //
    //     fixture.componentInstance.save();
    //
    //     //wait for any promise to resolve then execute the code
    //     fixture.whenStable().then(() => {
    //         expect(mockHeroService.updateHero).toHaveBeenCalled();
    //     })
    // }));
})
