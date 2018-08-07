import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { initTest } from '../../../../test';
import { FilterTypeEnum, IFilterCategoryBiz } from '../bizModel/model/filterCategory.biz.model';
import { ErrorService } from './error.service';
import { FilterCategoryService } from './filterCategory.service';

const url = 'http://localhost:3000/filterCategories';

const filterCategoryData: IFilterCategoryBiz = {
    name: '类型',
    filterType: FilterTypeEnum.ViewPoint,
    filterFunction: 'filterByCategory',
    criteries: [
        {
            name: '景点',
            criteria: '景点',
            isChecked: false,
            id: '5a4b4d6030e1cf2b19b493da'
        },
        {
            name: '美食',
            criteria: '美食',
            isChecked: false,
            id: '5a4b4d6030e1cf2b19b493d9'
        }
    ],
    id: '5a4b4d6030e1cf2b19b493d8'
};

const changeData: IFilterCategoryBiz = Object.assign({}, filterCategoryData, {
    name: '类型1'
});

const errorData = {
    status: 404,
    statusText: 'Not Found'
};

let service: FilterCategoryService;
let errorService: ErrorService;
let httpTestingController: HttpTestingController;

let result;
let error;

describe('filterCategory test', () => {
    beforeEach(async () => {
        await initTest();

        httpTestingController = TestBed.get(HttpTestingController);
        service = TestBed.get(FilterCategoryService);
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
            req.flush([filterCategoryData]);

            expect(result).toEqual([filterCategoryData]);
            expect(error).toEqual(null);
            expect(service.byType(FilterTypeEnum.ViewPoint)).toEqual([filterCategoryData]);
        });
        it('#byId()', () => {
            service.fetch();
            const req = httpTestingController.expectOne(url);
            req.flush([filterCategoryData]);

            expect(service.byId(filterCategoryData.id)).toEqual(filterCategoryData);
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
            service.add(filterCategoryData);
            const req = httpTestingController.expectOne(url);
            req.flush([filterCategoryData]);

            expect(service.byId(filterCategoryData.id)).toEqual(filterCategoryData);
        });

        it('#add() with backend error', () => {
            service.add(filterCategoryData);
            const req = httpTestingController.expectOne(url);
            req.flush('error happened', errorData);

            expect(result).toEqual([]);
            expect(error.network).toBeFalsy();
        });

        it('#add() with network error', () => {
            service.add(filterCategoryData);
            const req = httpTestingController.expectOne(url);
            req.error(new ErrorEvent('network error'));

            expect(result).toEqual([]);
            expect(error.network).toBeTruthy();
        });
    });

    describe('change test', () => {
        beforeEach(() => {
            service.add(filterCategoryData);
            const req = httpTestingController.expectOne(url);

            req.flush([filterCategoryData]);
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

            expect(result).toEqual([filterCategoryData]);
            expect(error.network).toBeFalsy();
        });

        it('#change() with network error', () => {
            service.change(changeData);
            const req = httpTestingController.expectOne(url);
            req.error(new ErrorEvent('network error'));

            expect(result).toEqual([filterCategoryData]);
            expect(error.network).toBeTruthy();
        });
    });

    describe('delete test', () => {
        beforeEach(() => {
            service.add(filterCategoryData);
            const req = httpTestingController.expectOne(url);

            req.flush([filterCategoryData]);
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

            expect(result).toEqual([filterCategoryData]);
            expect(error.network).toBeFalsy();
        });

        it('#delete() with network error', () => {
            service.remove(changeData);
            const req = httpTestingController.expectOne(`${url}/${changeData.id}`);
            req.error(new ErrorEvent('network error'));

            expect(result).toEqual([filterCategoryData]);
            expect(error.network).toBeTruthy();
        });
    });
});
