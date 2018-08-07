import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { initTest } from '../../../../test';
import { ITransportationCategoryBiz } from '../bizModel/model/travelAgenda.biz.model';
import { ErrorService } from './error.service';
import { TransportationCategoryService } from './transportationCategory.service';

const url = 'http://localhost:3000/transportationCategories';

const transportationCategoryData: ITransportationCategoryBiz = {
    name: 'Bus',
    isDefault: false,
    id: '5a4b5756764fba2c80ef5ba1'
};

const changeData: ITransportationCategoryBiz = Object.assign({}, transportationCategoryData, {
    name: 'Walk'
});

const errorData = {
    status: 404,
    statusText: 'Not Found'
};

let service: TransportationCategoryService;
let errorService: ErrorService;
let httpTestingController: HttpTestingController;

let result;
let error;

describe('transportation Category test', () => {
    beforeEach(async () => {
        await initTest();

        httpTestingController = TestBed.get(HttpTestingController);
        service = TestBed.get(TransportationCategoryService);
        errorService = TestBed.get(ErrorService);

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
            req.flush([transportationCategoryData]);

            expect(result).toEqual([transportationCategoryData]);
            expect(error).toEqual(null);
        });
        it('#byId()', () => {
            service.fetch();
            const req = httpTestingController.expectOne(url);
            req.flush([transportationCategoryData]);

            expect(service.byId(transportationCategoryData.id)).toEqual(transportationCategoryData);
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
            service.add(transportationCategoryData);
            const req = httpTestingController.expectOne(url);
            req.flush([transportationCategoryData]);

            expect(service.byId(transportationCategoryData.id)).toEqual(transportationCategoryData);
        });

        it('#add() with backend error', () => {
            service.add(transportationCategoryData);
            const req = httpTestingController.expectOne(url);
            req.flush('error happened', errorData);

            expect(result).toEqual([]);
            expect(error.network).toBeFalsy();
        });

        it('#add() with network error', () => {
            service.add(transportationCategoryData);
            const req = httpTestingController.expectOne(url);
            req.error(new ErrorEvent('network error'));

            expect(result).toEqual([]);
            expect(error.network).toBeTruthy();
        });
    });

    describe('change test', () => {
        beforeEach(() => {
            service.add(transportationCategoryData);
            const req = httpTestingController.expectOne(url);

            req.flush([transportationCategoryData]);
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

            expect(result).toEqual([transportationCategoryData]);
            expect(error.network).toBeFalsy();
        });

        it('#change() with network error', () => {
            service.change(changeData);
            const req = httpTestingController.expectOne(url);
            req.error(new ErrorEvent('network error'));

            expect(result).toEqual([transportationCategoryData]);
            expect(error.network).toBeTruthy();
        });
    });

    describe('delete test', () => {
        beforeEach(() => {
            service.add(transportationCategoryData);
            const req = httpTestingController.expectOne(url);

            req.flush([transportationCategoryData]);
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

            expect(result).toEqual([transportationCategoryData]);
            expect(error.network).toBeFalsy();
        });

        it('#delete() with network error', () => {
            service.remove(changeData);
            const req = httpTestingController.expectOne(`${url}/${changeData.id}`);
            req.error(new ErrorEvent('network error'));

            expect(result).toEqual([transportationCategoryData]);
            expect(error.network).toBeTruthy();
        });
    });
});
