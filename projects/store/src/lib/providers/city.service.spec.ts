import { HttpTestingController } from '@angular/common/http/testing';
import { getTestBed } from '@angular/core/testing';

import { initTest } from '../../../../test';
import { ICityBiz } from '../bizModel/model/city.biz.model';
import { CityService } from './city.service';
import { ErrorService } from './error.service';

const url = 'http://localhost:3000/cities';

const cityData: ICityBiz = {
    addressCode: '341000',
    name: '黄山2',
    thumbnail: 'assets/img/alan.png',
    id: '5a4b5756764fba2c80ef5ba1'
};

const changeData: ICityBiz = Object.assign({}, cityData, {
    name: '黄山3'
});

const errorData = {
    status: 404,
    statusText: 'Not Found'
};

let service: CityService;
let errorService: ErrorService;
let httpTestingController: HttpTestingController;

let result;
let error; // actionError;

describe('city test', () => {
    beforeEach(async () => {
        await initTest();

        httpTestingController = getTestBed().get(HttpTestingController);
        service = getTestBed().get(CityService);
        errorService = getTestBed().get(ErrorService);

        errorService.lastError$.subscribe((value) => {
            error = value;
        });
        service.all$.subscribe((value) => {
            result = value;
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
            req.flush([cityData]);

            expect(result).toEqual([cityData]);
            expect(error).toEqual(null);
        });
        it('#byId()', () => {
            service.fetch();
            const req = httpTestingController.expectOne(url);
            req.flush([cityData]);

            expect(service.byId(cityData.id)).toEqual(cityData);
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
            service.add(cityData);
            const req = httpTestingController.expectOne(url);
            req.flush([cityData]);

            expect(service.byId(cityData.id)).toEqual(cityData);
        });

        it('#add() with backend error', () => {
            service.add(cityData);
            const req = httpTestingController.expectOne(url);

            req.flush('error happened', errorData);

            expect(result).toEqual([]);
            expect(error.network).toBeFalsy();
        });

        it('#add() with network error', () => {
            service.add(cityData);
            const req = httpTestingController.expectOne(url);
            req.error(new ErrorEvent('network error'));

            expect(result).toEqual([]);
            expect(error.network).toBeTruthy();
        });
    });

    describe('change test', () => {
        beforeEach(() => {
            service.add(cityData);
            const req = httpTestingController.expectOne(url);

            req.flush([cityData]);
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

            expect(result).toEqual([cityData]);
            expect(error.network).toBeFalsy();
        });

        it('#change() with network error', () => {
            service.change(changeData);
            const req = httpTestingController.expectOne(url);
            req.error(new ErrorEvent('network error'));

            expect(result).toEqual([cityData]);
            expect(error.network).toBeTruthy();
        });
    });

    describe('delete test', () => {
        beforeEach(() => {
            service.add(cityData);
            const req = httpTestingController.expectOne(url);

            req.flush([cityData]);
        });

        it('#delete()', () => {
            service.remove(cityData);
            const req = httpTestingController.expectOne(`${url}/${cityData.id}`);
            req.flush([cityData]);

            expect(result).toEqual([]);
            expect(error).toEqual(null);
        });

        it('#delete() with backend error', () => {
            service.remove(cityData);
            const req = httpTestingController.expectOne(`${url}/${cityData.id}`);
            req.flush('error happened', errorData);

            expect(result).toEqual([cityData]);
            expect(error.network).toBeFalsy();
        });

        it('#delete() with network error', () => {
            service.remove(cityData);
            const req = httpTestingController.expectOne(`${url}/${cityData.id}`);
            req.error(new ErrorEvent('network error'));

            expect(result).toEqual([cityData]);
            expect(error.network).toBeTruthy();
        });
    });
});
