import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { initTest } from '../../../../test';
import { AuthService } from '../../auth/providers/authService';
import { IUserBiz } from '../bizModel/model/user.biz.model';
import { ErrorService } from './error.service';
import { UserService } from './user.service';

const url = 'http://localhost:3000/users';
const loginUrl = `http://localhost:3000/auth/login`;

const loginData = {
    username: 'cxt',
    password: 'cxt'
};

const loginRes = {
    auth_app_token: `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiY3h0IiwibmljayI6ImFkbWluIiwicGljdHVyZSI6ImFzc2V0cy9pb
    WcvamFjay5wbmciLCJpZCI6IjVhNGI1NzU2NzY0ZmJhMmM4MGVmNWJhYiIsImlhdCI6MTUyNDk3Nzg0MSwic3ViIjoiY3h0In0.UrTnwhRaQrsl6i6KvjHc
    JkXhoKNpdPWpk2A-Dti2wJly6Qm0EyhrIFcB9rEizphgPUPrqUXOw7n9hPSqgbPlK54mR3KXHGMSoKr2y1ELEmPwOmd2AZ3KRX0Nn4kYxHYCFuCsWWGJyDU
    k4DlcJ74l25P0Z7XdGn51fTzn0TFKestq0BrLsDwvjeVH1s7KCSSqCD9soAo_UochNoJv_2cDTthtrRJg7yw8dMHFMSG-JHGkBcIYSPOd0N9eWl4Y2hyvcS
    PZrQ6Jp8wmA-skUImYba8syeZZKuaqX4hLU-Ev8Q2uiXgUf4xzwVZcbLcrxjhRX2Ksh6SRON-7JNPxSE5up_Qob13J7wdWo3pwM6rFxCSchbPDMYEuW8LrI
    7Z4yKpE34Zl4WCOfsoy4bhbFPIjcELiKZsZ7LS_mo4qLGebHIDZiZGSWz9p5zyS8PVBHBJMbwBhP0Uq52ksgSeItU5jBvPmFRaqDLuBowgaJ5vK8R6Kr8RM
    WDODYoNasQYelBIIbjQphmulzRrVUJvyXng7SAGYMJOr2oYyuD7OevPQIpZN9GmiasQALh7HH3JeNOmjump2sPRmXnSeoJl5jQ6it8FrxkyCwTH3tdOEqBD
    crcZM8DfplL-_EzD36wBLVFKs2Q9ed0ij6JbtCZDzprIAV0ToBfqvWzshyznwSdV0xBE`
};

const userData: IUserBiz = {
    name: 'cxt',
    picture: 'assets/img/jack.png',
    nick: 'admin',
    id: '5a4b5756764fba2c80ef5bab'
};

const changeData: IUserBiz = Object.assign({}, userData, {
    name: 'cxt1'
});

const errorData = {
    status: 404,
    statusText: 'Not Found'
};

let service: UserService;
let auth: AuthService;
let errorService: ErrorService;
let httpTestingController: HttpTestingController;

let result, loggedIn;
let error;

describe('user test', () => {
    beforeEach(async () => {
        await initTest();

        httpTestingController = TestBed.get(HttpTestingController);
        service = TestBed.get(UserService);
        auth = TestBed.get(AuthService);
        errorService = TestBed.get(ErrorService);

        errorService.lastError$.subscribe((value) => {
            error = value;
        });
        service.all$.subscribe((value) => {
            result = value;
        });
        service.loggedIn$.subscribe((value) => {
            loggedIn = value;
        });
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    describe('fetch test', () => {
        it('#fetch()', () => {
            service.fetch();
            const req = httpTestingController.expectOne(url);
            req.flush([userData]);

            expect(result).toEqual([userData]);
            expect(error).toEqual(null);
        });
        it('#byId()', () => {
            service.fetch();
            const req = httpTestingController.expectOne(url);
            req.flush([userData]);

            expect(service.byId(userData.id)).toEqual(userData);
        });
        it('#fetch() with backend error', () => {
            service.fetch();
            const req = httpTestingController.expectOne(url);
            req.flush('error happened', errorData);

            expect(result).toEqual([]);
            expect(error.network).toBeFalsy();
            expect(error.description).toEqual('error happened');
        });

        it('#fetch() with network error', () => {
            service.fetch();
            const req = httpTestingController.expectOne(url);
            req.error(new ErrorEvent('network error'));

            expect(result).toEqual([]);
            expect(error.network).toBeTruthy();
        });
    });

    describe('add test', () => {
        it('#add()', () => {
            service.add(userData);
            const req = httpTestingController.expectOne(url);
            req.flush([userData]);

            expect(service.byId(userData.id)).toEqual(userData);
        });

        it('#add() with backend error', () => {
            service.add(userData);
            const req = httpTestingController.expectOne(url);
            req.flush('error happened', errorData);

            expect(result).toEqual([]);
            expect(error.network).toBeFalsy();
        });

        it('#add() with network error', () => {
            service.add(userData);
            const req = httpTestingController.expectOne(url);
            req.error(new ErrorEvent('network error'));

            expect(result).toEqual([]);
            expect(error.network).toBeTruthy();
        });
    });

    describe('change test', () => {
        beforeEach(() => {
            service.add(userData);
            const req = httpTestingController.expectOne(url);

            req.flush([userData]);
        });
        it('#change()', () => {
            service.change(changeData);
            const req = httpTestingController.expectOne(url);
            req.flush([changeData]);

            expect(result).toEqual([changeData]);
            expect(error).toEqual(null);
        });

        it('#change() with backend error', () => {
            service.change(changeData);
            const req = httpTestingController.expectOne(url);
            req.flush('error happened', errorData);

            expect(result).toEqual([userData]);
            expect(error.network).toBeFalsy();
        });

        it('#change() with network error', () => {
            service.change(changeData);
            const req = httpTestingController.expectOne(url);
            req.error(new ErrorEvent('network error'));

            expect(result).toEqual([userData]);
            expect(error.network).toBeTruthy();
        });
    });

    describe('delete test', () => {
        beforeEach(() => {
            service.add(userData);
            const req = httpTestingController.expectOne(url);

            req.flush([userData]);
        });
        it('#delete()', () => {
            service.remove(changeData);
            const req = httpTestingController.expectOne(`${url}/${changeData.id}`);
            req.flush([changeData]);

            expect(result).toEqual([]);
            expect(error).toEqual(null);
        });

        it('#delete() with backend error', () => {
            service.remove(changeData);
            const req = httpTestingController.expectOne(`${url}/${changeData.id}`);
            req.flush('error happened', errorData);

            expect(result).toEqual([userData]);
            expect(error.network).toBeFalsy();
        });

        it('#delete() with network error', () => {
            service.remove(changeData);
            const req = httpTestingController.expectOne(`${url}/${changeData.id}`);
            req.error(new ErrorEvent('network error'));

            expect(result).toEqual([userData]);
            expect(error.network).toBeTruthy();
        });
    });

    describe('user login test', () => {
        beforeEach(() => {
            service.add(userData);
            const req = httpTestingController.expectOne(url);

            req.flush([userData]);
        });

        it('#login()', () => {
            auth.authenticate(loginData).subscribe((value) => {
                console.log(value);
            });

            const req = httpTestingController.expectOne(loginUrl);

            req.flush(loginRes);

            expect(service.loggedIn).toEqual(userData);
            expect(loggedIn).toEqual(userData);
        });
    });
});
