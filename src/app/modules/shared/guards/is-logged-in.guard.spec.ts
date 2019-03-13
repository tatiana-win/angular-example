import {TestBed, async, inject} from '@angular/core/testing';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';

import {IsLoggedInGuard} from './is-logged-in.guard';
import {UserService} from '@app/modules/core';

import {UserServiceStub} from '@testing/user-service-stub';

describe('IsLoggedInGuard', () => {
  const mockSnapshot = jasmine.createSpyObj<RouterStateSnapshot>('RouterStateSnapshot', ['toString']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      providers: [
        IsLoggedInGuard,
        {provide: UserService, useClass: UserServiceStub}
      ]
    });
  });

  describe('Anonymous user', () => {

    beforeEach(() => {
      const userService = TestBed.get(UserService);
      spyOn(userService, 'isLogged').and.returnValue(false);
    });

    it('should not allow anonymous user to load module', async(inject([IsLoggedInGuard, Router], (guard, router) => {
        const spy = spyOn(router, 'navigate');
        const guardResult = guard.canLoad(new ActivatedRouteSnapshot(), mockSnapshot);

        expect(guardResult).toBe(false);
        expect(spy.calls.mostRecent().args[0]).toEqual(['/login']);
      })
    ));

    it('should not allow anonymous user to activate route', async(inject([IsLoggedInGuard, Router], (guard, router) => {
        const spy = spyOn(router, 'navigate');
        const guardResult = guard.canActivate(new ActivatedRouteSnapshot(), mockSnapshot);

        expect(guardResult).toBe(false);
        expect(spy.calls.mostRecent().args[0]).toEqual(['/login']);
      })
    ));

    it('should not allow anonymous user to activate child route', async(inject([IsLoggedInGuard, Router], (guard, router) => {
        const spy = spyOn(router, 'navigate');
        const guardResult = guard.canActivateChild(new ActivatedRouteSnapshot(), mockSnapshot);

        expect(guardResult).toBe(false);
        expect(spy.calls.mostRecent().args[0]).toEqual(['/login']);
      })
    ));
  });

  describe('Logged in user', () => {

    beforeEach(() => {
      const userService = TestBed.get(UserService);
      spyOn(userService, 'isLogged').and.returnValue(true);
    });

    it('should allow authenticated user to load module', async(inject([IsLoggedInGuard, Router], (guard, router) => {
        const userService = TestBed.get(UserService);
        userService.setTokens({slt: 'fake_slt', llt: 'fake_llt'});

        const spy = spyOn(router, 'navigate');
        const guardResult = guard.canLoad(new ActivatedRouteSnapshot(), mockSnapshot);

        expect(guardResult).toBe(true);
        expect(spy.calls.any()).toBe(false);
      })
    ));

    it('should allow authenticated user to activate route', async(inject([IsLoggedInGuard, Router], (guard, router) => {
        const userService = TestBed.get(UserService);
        userService.setTokens({slt: 'fake_slt', llt: 'fake_llt'});

        const spy = spyOn(router, 'navigate');
        const guardResult = guard.canActivate(new ActivatedRouteSnapshot(), mockSnapshot);

        expect(guardResult).toBe(true);
        expect(spy.calls.any()).toBe(false);
      })
    ));

    it('should allow authenticated user to activate child route', async(inject([IsLoggedInGuard, Router], (guard, router) => {
        const userService = TestBed.get(UserService);
        userService.setTokens({slt: 'fake_slt', llt: 'fake_llt'});

        const spy = spyOn(router, 'navigate');
        const guardResult = guard.canActivateChild(new ActivatedRouteSnapshot(), mockSnapshot);

        expect(guardResult).toBe(true);
        expect(spy.calls.any()).toBe(false);
      })
    ));
  });

});
