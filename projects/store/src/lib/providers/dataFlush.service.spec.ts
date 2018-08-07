import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { initTest } from '../../../../test';
import { ICityBiz } from '../bizModel/model/city.biz.model';
import { IDailyTripBiz, ITravelAgendaBiz, ITravelViewPointBiz } from '../bizModel/model/travelAgenda.biz.model';
import { IViewPointBiz, IViewPointCategoryBiz } from '../bizModel/model/viewPoint.biz.model';
import { ITransportationCategory } from '../entity/model/travelAgenda.model';
import { DataFlushService } from './dataFlush.service';
import { ErrorService } from './error.service';
import { TransportationCategoryService } from './transportationCategory.service';
import { TravelAgendaService } from './travelAgenda.service';
import { ViewPointService } from './viewPoint.service';

const url = 'http://localhost:3000/travelAgendas';

const transportationData: ITransportationCategory = {
    id: 'transportationCategoryId',
    name: 'Bus',
    isDefault: true
};

const cityData: ICityBiz = {
    id: '5a4b5756764fba2c80ef5ba1',
    name: '黄山',
    thumbnail: '',
    addressCode: '100'
};

const categoryData: IViewPointCategoryBiz = {
    id: '5acc62fe6c251979dd67f0c1',
    name: 'View'
};

const viewPointData: IViewPointBiz = {
    city: cityData,
    name: '老大桥9',
    category: categoryData,
    tags: [],
    description: '朱家角',
    tips: '老大桥测试OK',
    timeNeeded: '1-2小时',
    address: '黄山中路888号',
    latitude: 29.813,
    longtitude: 118.22,
    rank: 5,
    thumbnail: 'assets/img/IMG_4201.jpg',
    comments: [],
    countOfComments: 0,
    images: [
        'assets/img/IMG_4203.jpg',
        'assets/img/IMG_4204.jpg'
    ],
    id: '5a4b5756764fba2c878a5ba9'
};

const viewPointData_1: IViewPointBiz = Object.assign({}, viewPointData, {
    name: '老大桥10',
    id: '5a4b5756764fba2c87888ba9'
});

const travelViewPointData: ITravelViewPointBiz = {
    id: '5a4b5756764fba2c878accc9',
    distanceToNext: 100,
    transportationToNext: null,
    viewPoint: viewPointData,
    dailyTrip: null
};

const dailyTripData: IDailyTripBiz = {
    id: '5a4b5756764fba2c87dddba9',
    travelViewPoints: [travelViewPointData],
    lastViewPoint: travelViewPointData,
    travelAgenda: null
};

const travelAgendaData: ITravelAgendaBiz = {
    id: '5a4b5756764fb8u7c78a5ba9',
    name: '黄山',
    user: 'whoiscxt',
    cover: 'assets/img/IMG_4201.jpg',
    dailyTrips: [dailyTripData]
};

travelViewPointData.dailyTrip = dailyTripData;
dailyTripData.travelAgenda = travelAgendaData;

const errorData = {
    status: 404,
    statusText: 'Not Found'
};

let service: TravelAgendaService;
let transportationService: TransportationCategoryService;
let viewPointService: ViewPointService;
let flushService: DataFlushService;
let errorService: ErrorService;
let httpTestingController: HttpTestingController;

let result;
let error;
let dirtyIds;

describe('flush test', () => {
    beforeEach(async () => {
        await initTest();

        httpTestingController = TestBed.get(HttpTestingController);
        service = TestBed.get(TravelAgendaService);
        errorService = TestBed.get(ErrorService);
        transportationService = TestBed.get(TransportationCategoryService);
        viewPointService = TestBed.get(ViewPointService);
        flushService = TestBed.get(DataFlushService);

        errorService.lastError$.subscribe((value) => {
            error = value;
        });
        service.all$.subscribe((value) => {
            result = value;
        });
        flushService.dirtyIds$.subscribe((value) => {
            dirtyIds = value;
        });

        transportationService.fetch();
        let req = httpTestingController.expectOne('http://localhost:3000/transportationCategories');
        req.flush([transportationData]);

        viewPointService.fetch();
        req = httpTestingController.expectOne('http://localhost:3000/viewPoints');
        req.flush([viewPointData, viewPointData_1]);

    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    describe('dirty logic', () => {
        it('#success add(), followed by failed change()', () => {
            const addedTravelAgenda = Object.assign({}, travelAgendaData, { dailyTrips: [] });
            // 1. Add empty TravelAgenda
            service.add(addedTravelAgenda);
            let req = httpTestingController.expectOne(url);
            req.flush([addedTravelAgenda]);

            expect(result).toEqual([addedTravelAgenda]);
            expect(error).toEqual(null);
            expect(dirtyIds.travelAgendas.created.length).toEqual(0);

            // 2. Change
            const changedTravelAgenda = Object.assign({}, travelAgendaData, { name: '黄山1' });
            service.change(changedTravelAgenda);
            req = httpTestingController.expectOne(url);
            req.flush('error happened', errorData);

            expect(result[0].name).toEqual('黄山1');
            expect(dirtyIds.travelAgendas.created.length).toEqual(0);
            expect(dirtyIds.travelAgendas.updated[0]).toEqual(result[0].id);
            expect(dirtyIds.travelAgendas.updated.length).toEqual(1);
        });
        it('#success add(), followed by failed delete()', () => {
            const addedTravelAgenda = Object.assign({}, travelAgendaData, { dailyTrips: [] });
            // 1. Add empty TravelAgenda
            service.add(addedTravelAgenda);
            let req = httpTestingController.expectOne(url);
            req.flush([addedTravelAgenda]);

            expect(result).toEqual([addedTravelAgenda]);
            expect(error).toEqual(null);
            expect(dirtyIds.travelAgendas.created.length).toEqual(0);

            // 2. Delete
            service.remove(result[0]);
            req = httpTestingController.expectOne(`${url}/${result[0].id}`);
            req.flush('error happened', errorData);

            expect(result.length).toEqual(0);
            expect(dirtyIds.travelAgendas.created.length).toEqual(0);
            expect(dirtyIds.travelAgendas.deleted[0]).toEqual(addedTravelAgenda.id);
            expect(dirtyIds.travelAgendas.deleted.length).toEqual(1);
        });
        it('#success add(), followed by failed change(), followed by delete()', () => {
            const addedTravelAgenda = Object.assign({}, travelAgendaData, { dailyTrips: [] });
            // 1. Add empty TravelAgenda
            service.add(addedTravelAgenda);
            let req = httpTestingController.expectOne(url);
            req.flush([addedTravelAgenda]);

            expect(result).toEqual([addedTravelAgenda]);
            expect(error).toEqual(null);
            expect(dirtyIds.travelAgendas.created.length).toEqual(0);

            // 2. Change
            const changedTravelAgenda = Object.assign({}, travelAgendaData, { name: '黄山1' });
            service.change(changedTravelAgenda);
            req = httpTestingController.expectOne(url);
            req.flush('error happened', errorData);

            expect(result[0].name).toEqual('黄山1');
            expect(dirtyIds.travelAgendas.created.length).toEqual(0);
            expect(dirtyIds.travelAgendas.updated[0]).toEqual(result[0].id);
            expect(dirtyIds.travelAgendas.updated.length).toEqual(1);

            // 2. Delete
            service.remove(result[0]);
            req = httpTestingController.expectOne(`${url}/${result[0].id}`);
            req.flush([result[0]]);

            expect(result.length).toEqual(0);
            expect(dirtyIds.travelAgendas.created.length).toEqual(0);
            expect(dirtyIds.travelAgendas.updated.length).toEqual(0);
            expect(dirtyIds.travelAgendas.deleted.length).toEqual(0);
        });
        it('#failed add(), followed by failed change()', () => {
            const addedTravelAgenda = Object.assign({}, travelAgendaData, { dailyTrips: [] });
            // 1. Add empty TravelAgenda
            const actionId = service.add(addedTravelAgenda);
            let req = httpTestingController.expectOne(url);
            req.flush('error happened', errorData);

            expect(result).toEqual([addedTravelAgenda]);
            expect(error.network).toBeFalsy();
            expect(error.description).toEqual('error happened');
            expect(dirtyIds.travelAgendas.created.length).toEqual(1);
            expect(dirtyIds.travelAgendas.created[0]).toEqual(result[0].id);

            // 2. Change
            const changedTravelAgenda = Object.assign({}, travelAgendaData, { name: '黄山1' });
            service.change(changedTravelAgenda);
            req = httpTestingController.expectOne(url);
            req.flush('error happened', errorData);

            expect(result[0].name).toEqual('黄山1');
            expect(dirtyIds.travelAgendas.created.length).toEqual(1);
            expect(dirtyIds.travelAgendas.created[0]).toEqual(result[0].id);
            expect(dirtyIds.travelAgendas.updated.length).toEqual(0);

        });
        it('#failed add(), followed by successfully change()', () => {
            const addedTravelAgenda = Object.assign({}, travelAgendaData, { dailyTrips: [] });
            // 1. Add empty TravelAgenda
            const actionId = service.add(addedTravelAgenda);
            let req = httpTestingController.expectOne(url);
            req.flush('error happened', errorData);

            expect(result).toEqual([addedTravelAgenda]);
            expect(error.network).toBeFalsy();
            expect(dirtyIds.travelAgendas.created.length).toEqual(1);
            expect(dirtyIds.travelAgendas.created[0]).toEqual(result[0].id);

            // 2. Change
            const changedTravelAgenda = Object.assign({}, travelAgendaData, { name: '黄山1' });
            service.change(changedTravelAgenda);
            req = httpTestingController.expectOne(url);
            req.flush([changedTravelAgenda]);

            expect(result[0].name).toEqual('黄山1');
            expect(dirtyIds.travelAgendas.created.length).toEqual(0);
            expect(dirtyIds.travelAgendas.updated.length).toEqual(0);

        });
        it('#failed add(), followed by delete()', () => {
            const addedTravelAgenda = Object.assign({}, travelAgendaData, { dailyTrips: [] });
            // 1. Add empty TravelAgenda
            const actionId = service.add(addedTravelAgenda);
            const req = httpTestingController.expectOne(url);
            req.flush('error happened', errorData);

            expect(result).toEqual([addedTravelAgenda]);
            expect(error.network).toBeFalsy();
            expect(dirtyIds.travelAgendas.created.length).toEqual(1);
            expect(dirtyIds.travelAgendas.created[0]).toEqual(result[0].id);

            // 2. Delete
            service.remove(result[0]);
            httpTestingController.expectNone(url);

            expect(result.length).toEqual(0);
            expect(dirtyIds.travelAgendas.created.length).toEqual(0);
            expect(dirtyIds.travelAgendas.updated.length).toEqual(0);
            expect(dirtyIds.travelAgendas.deleted.length).toEqual(0);
        });
    });

    describe('flush logic', () => {
        it('#failed add(), followed by flush', () => {
            const addedTravelAgenda = Object.assign({}, travelAgendaData, { dailyTrips: [] });
            // 1. Add empty TravelAgenda
            const actionId = service.add(addedTravelAgenda);
            let req = httpTestingController.expectOne(url);
            req.flush('error happened', errorData);

            expect(result).toEqual([addedTravelAgenda]);
            expect(error.network).toBeFalsy();
            expect(dirtyIds.travelAgendas.created.length).toEqual(1);
            expect(dirtyIds.travelAgendas.created[0]).toEqual(result[0].id);

            // 2. Flush
            flushService.flush();
            req = httpTestingController.expectOne(url);
            req.flush([result[0]]);

            expect(result[0].name).toEqual('黄山');
            expect(dirtyIds.travelAgendas.created.length).toEqual(0);
            expect(error).toEqual(null);
            expect(dirtyIds.travelAgendas.updated.length).toEqual(0);
        });

        it('#success add(), followed by failed change(), followed by flush', () => {
            const addedTravelAgenda = Object.assign({}, travelAgendaData, { dailyTrips: [] });
            // 1. Add empty TravelAgenda
            service.add(addedTravelAgenda);
            let req = httpTestingController.expectOne(url);
            req.flush([addedTravelAgenda]);

            expect(result).toEqual([addedTravelAgenda]);
            expect(error).toEqual(null);
            expect(dirtyIds.travelAgendas.created.length).toEqual(0);

            // 2. Change
            const changedTravelAgenda = Object.assign({}, travelAgendaData, { name: '黄山1' });
            service.change(changedTravelAgenda);
            req = httpTestingController.expectOne(url);
            req.flush('error happened', errorData);

            expect(result[0].name).toEqual('黄山1');
            expect(dirtyIds.travelAgendas.created.length).toEqual(0);
            expect(dirtyIds.travelAgendas.updated[0]).toEqual(result[0].id);
            expect(dirtyIds.travelAgendas.updated.length).toEqual(1);

            // 3. Flush
            flushService.flush();
            req = httpTestingController.expectOne(url);
            req.flush([result[0]]);

            expect(result[0].name).toEqual('黄山1');
            expect(dirtyIds.travelAgendas.created.length).toEqual(0);
            expect(error).toEqual(null);
            expect(dirtyIds.travelAgendas.updated.length).toEqual(0);
        });

        it('#success add(), followed by failed delete(), followed by flush', () => {
            const addedTravelAgenda = Object.assign({}, travelAgendaData, { dailyTrips: [] });
            // 1. Add empty TravelAgenda
            service.add(addedTravelAgenda);
            let req = httpTestingController.expectOne(url);
            req.flush([addedTravelAgenda]);

            expect(result).toEqual([addedTravelAgenda]);
            expect(error).toEqual(null);
            expect(dirtyIds.travelAgendas.created.length).toEqual(0);

            // 2. Delete
            const actionId = service.remove(result[0]);
            req = httpTestingController.expectOne(`${url}/${result[0].id}`);
            req.flush('error happened', errorData);

            expect(result.length).toEqual(0);
            expect(dirtyIds.travelAgendas.created.length).toEqual(0);
            expect(dirtyIds.travelAgendas.deleted[0]).toEqual(addedTravelAgenda.id);
            expect(dirtyIds.travelAgendas.deleted.length).toEqual(1);
            expect(error.network).toBeFalsy();

            // 3. Flush
            flushService.flush();
            req = httpTestingController.expectOne(`${url}/${addedTravelAgenda.id}`);
            req.flush([addedTravelAgenda]);

            expect(result.length).toEqual(0);
            expect(dirtyIds.travelAgendas.created.length).toEqual(0);
            expect(error).toEqual(null);
            expect(dirtyIds.travelAgendas.updated.length).toEqual(0);
        });
    });
});
