import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { initTest } from '../../../../test';
import { ErrorService } from './error.service';
import { ViewPointService } from './viewPoint.service';

const url = 'http://localhost:3000/viewPoints';

const viewPointData = {
    city: {
        addressCode: '341000',
        name: '黄山2',
        thumbnail: 'assets/img/alan.png',
        id: '5a4b5756764fba2c80ef5ba1'
    },
    updatedAt: '2017-12-31T16:41:34.724Z',
    createdAt: '2017-12-31T16:37:36.733Z',
    name: '老街',
    category: {
        id: '5acc62fe6c251979dd67f0c1',
        name: '景点'
    },
    tags: [
        '人文'
    ],
    description: '朱家角',
    tips: '老大桥测试OK，完全好玩不过但是。',
    timeNeeded: '1-2小时',
    address: '黄山中路888号',
    latitude: 29.8,
    longtitude: 118.3,
    rank: 4.5,
    thumbnail: 'assets/img/IMG_4201.jpg',
    comments: [
        {
            detail: '朱家角镇',
            user: 'Xiaotian',
            avatar: 'assets/img/IMG_4203.jpg',
            rate: 3.5,
            images: [
                'assets/img/IMG_4203.jpg',
                'assets/img/IMG_4204.jpg'
            ],
            publishedAt: new Date('2017-12-31T16:37:36.718Z'),
            id: 'aaa912502350c4065c30f6ae'
        }
    ],
    countOfComments: 11,
    images: [
        'assets/img/IMG_4203.jpg',
        'assets/img/IMG_4204.jpg',
        'assets/img/IMG_4203.jpg',
        'assets/img/IMG_4204.jpg'
    ],
    id: '5a4912502350c4065c30f6ad'
};

const changeData = Object.assign({}, viewPointData, {
    name: '老街123'
});

const errorData = {
    status: 404,
    statusText: 'Not Found'
};

let service: ViewPointService;
let errorService: ErrorService;
let httpTestingController: HttpTestingController;

let result;
let error;

describe('viewPoint test', () => {
    beforeEach(async () => {
        await initTest();

        httpTestingController = TestBed.get(HttpTestingController);
        service = TestBed.get(ViewPointService);
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
            req.flush([viewPointData]);

            expect(result).toEqual([viewPointData]);
            expect(error).toEqual(null);
        });
        it('#byId()', () => {
            service.fetch();
            const req = httpTestingController.expectOne(url);
            req.flush([viewPointData]);

            expect(service.byId(viewPointData.id)).toEqual(viewPointData);
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
            service.add(viewPointData);
            const req = httpTestingController.expectOne(url);
            req.flush([viewPointData]);

            expect(service.byId(viewPointData.id)).toEqual(viewPointData);
        });

        it('#add() with backend error', () => {
            service.add(viewPointData);
            const req = httpTestingController.expectOne(url);
            req.flush('error happened', errorData);

            expect(result).toEqual([]);
            expect(error.network).toBeFalsy();
        });

        it('#add() with network error', () => {
            service.add(viewPointData);
            const req = httpTestingController.expectOne(url);
            req.error(new ErrorEvent('network error'));

            expect(result).toEqual([]);
            expect(error.network).toBeTruthy();
        });
    });

    describe('change test', () => {
        beforeEach(() => {
            service.add(viewPointData);
            const req = httpTestingController.expectOne(url);

            req.flush([viewPointData]);
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

            expect(result).toEqual([viewPointData]);
            expect(error.network).toBeFalsy();
        });

        it('#change() with network error', () => {
            service.change(changeData);
            const req = httpTestingController.expectOne(url);
            req.error(new ErrorEvent('network error'));

            expect(result).toEqual([viewPointData]);
            expect(error.network).toBeTruthy();
        });
    });

    describe('delete test', () => {
        beforeEach(() => {
            service.add(viewPointData);
            const req = httpTestingController.expectOne(url);

            req.flush([viewPointData]);
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

            expect(result).toEqual([viewPointData]);
            expect(error.network).toBeFalsy();
        });

        it('#delete() with network error', () => {
            service.remove(changeData);
            const req = httpTestingController.expectOne(`${url}/${changeData.id}`);
            req.error(new ErrorEvent('network error'));

            expect(result).toEqual([viewPointData]);
            expect(error.network).toBeTruthy();
        });
    });
});
