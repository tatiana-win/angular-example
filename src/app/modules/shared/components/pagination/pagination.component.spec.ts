import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';

import {TranslateModule} from '@ngx-translate/core';

import {PaginationComponent} from './pagination.component';

describe('PaginationComponent', () => {

  describe('HostComponent test', () => {
    @Component({
      template: `
        <app-pagination
          [currentPage]="currentPage"
          [pagesCount]="pagesCount"
          [displayCount]="displayCount"
          (pageChanged)="hostPageChanged($event)"
        ></app-pagination>
      `
    })
    class TestHostComponent {
      currentPage = 1;
      pagesCount = 10;
      displayCount = 5;

      hostPageChanged(): void {
      }
    }

    let component: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        imports: [
          TranslateModule.forRoot()
        ],
        declarations: [
          TestHostComponent,
          PaginationComponent
        ]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(TestHostComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render proper count of pages', () => {
      component.currentPage = 5;
      component.pagesCount = 15;
      component.displayCount = 5;
      fixture.detectChanges();

      const links = fixture.debugElement.queryAll(By.css('.pagination li'));

      expect(links.length).toBe(component.displayCount + 2, 'links + first and last');
    });

    it('should render \'first\'', () => {
      component.currentPage = 10;
      component.pagesCount = 10;
      component.displayCount = 5;
      fixture.detectChanges();

      const firstLink = fixture.debugElement.query(By.css('.pagination .first'));

      expect(firstLink !== null).toBe(true, 'render first link');
    });

    it('should render \'last\'', () => {
      component.currentPage = 1;
      component.pagesCount = 10;
      component.displayCount = 5;
      fixture.detectChanges();

      const lastLink = fixture.debugElement.query(By.css('.pagination .last'));

      expect(lastLink !== null).toBe(true, 'render last link');
    });

    it('should not render \'first\' and \'last\' if not necessary', () => {
      component.currentPage = 3;
      component.pagesCount = 10;
      component.displayCount = 10;
      fixture.detectChanges();

      const firstLink = fixture.debugElement.query(By.css('.pagination .first'));
      const lastLink = fixture.debugElement.query(By.css('.pagination .last'));

      expect(firstLink === null).toBe(true, 'do not render first link');
      expect(lastLink === null).toBe(true, 'do not render last link');
    });

    it('should trigger new page event on click if new page is not current page', () => {
      const spy = spyOn(component, 'hostPageChanged');
      const expectedPage = 5;

      component.currentPage = 3;
      component.pagesCount = 10;
      component.displayCount = 10;
      fixture.detectChanges();

      const link = fixture.debugElement.query(By.css(`.pagination li a[data-page="${expectedPage}"]`));
      link.triggerEventHandler('click', null);
      fixture.detectChanges();

      expect(spy.calls.mostRecent().args[0]).toBe(expectedPage);
    });

    it('should not trigger new page event on click if page is already selected', () => {
      const spy = spyOn(component, 'hostPageChanged');
      const selectedPage = 5;

      component.currentPage = selectedPage;
      component.pagesCount = 10;
      component.displayCount = 10;
      fixture.detectChanges();

      const link = fixture.debugElement.query(By.css(`.pagination li a[data-page="${selectedPage}"]`));
      link.triggerEventHandler('click', null);
      fixture.detectChanges();

      expect(spy.calls.any()).toBe(false);
    });

  });

});
