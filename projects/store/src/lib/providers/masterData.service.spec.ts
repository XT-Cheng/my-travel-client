import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { zip } from 'rxjs/operators';

import { initTest } from '../../../../test';
import { IError } from '../error/error.model';
import { CityService } from './city.service';
import { ErrorService } from './error.service';
import { MasterDataService } from './masterData.service';
import { TransportationCategoryService } from './transportationCategory.service';
import { ViewPointCategoryService } from './viewPointCategory.service';

const url = 'http://localhost:3000/masterData';

const cityData = {
    addressCode: '341000',
    name: '黄山2',
    thumbnail: 'assets/img/alan.png',
    id: '5a4b5756764fba2c80ef5ba1'
};

const viewCategoryData = {
    name: 'View',
    id: '5a4b5756764fba2c80ef5ba1'
};

const transportationCategoryData = {
    name: 'Bus',
    id: '5a4b5756764cca2c80ef5ba1'
};

const flushData = {
    viewPointCategories: [
        viewCategoryData
    ],
    transportationCategories: [
        transportationCategoryData
    ],
    cities: [
        cityData
    ]
};

const errorData = {
    status: 404,
    statusText: 'Not Found'
};

const backendError: IError = {
    network: false,
    description: 'error happened',
    stack: '',
    actionId: ''
};

const networkError: IError = {
    network: true,
    description: '',
    stack: '',
    actionId: ''
};

let service: MasterDataService;
let viewPointCatService: ViewPointCategoryService;
let transportationCategoryService: TransportationCategoryService;
let errorService: ErrorService;
let cityService: CityService;
let httpTestingController: HttpTestingController;

let result;
let error;

describe('masterData test', () => {
    beforeEach(async () => {
        await initTest();

        httpTestingController = TestBed.get(HttpTestingController);
        service = TestBed.get(MasterDataService);
        transportationCategoryService = TestBed.get(TransportationCategoryService);
        cityService = TestBed.get(CityService);
        errorService = TestBed.get(ErrorService);
        viewPointCatService = TestBed.get(ViewPointCategoryService);

        errorService.lastError$.subscribe((value) => {
            error = value;
        });
        viewPointCatService.all$.pipe(
            zip(transportationCategoryService.all$, cityService.all$)
        ).subscribe((value) => {
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
            req.flush(flushData);

            expect(result).toEqual([[viewCategoryData], [transportationCategoryData], [cityData]]);
            expect(error).toEqual(null);
        });
        it('#fetch() with backend error', () => {
            const actionId = service.fetch();
            const req = httpTestingController.expectOne(url);
            req.flush('error happened', errorData);

            expect(result).toEqual([[], [], []]);
            expect(error).toEqual({ ...backendError, actionId });
        });

        it('#fetch() with network error', () => {
            const actionId = service.fetch();
            const req = httpTestingController.expectOne(url);
            req.error(new ErrorEvent('network error'));

            expect(result).toEqual([[], [], []]);
            expect(error).toEqual({ ...networkError, actionId });
        });
    });
});
