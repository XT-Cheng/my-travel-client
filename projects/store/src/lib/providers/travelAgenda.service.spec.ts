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

describe('travelAgenda test', () => {
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

    describe('fetch test', () => {
        it('#fetch()', () => {
            service.fetch();
            const req = httpTestingController.expectOne(url);
            req.flush([travelAgendaData]);

            expect(result).toEqual([travelAgendaData]);
        });
        it('#byId()', () => {
            service.fetch();
            const req = httpTestingController.expectOne(url);
            req.flush([travelAgendaData]);

            expect(service.byId(travelAgendaData.id)).toEqual(travelAgendaData);
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
            const addedTravelAgenda = Object.assign({}, travelAgendaData, { dailyTrips: [] });
            // 1. Add empty TravelAgenda
            service.add(addedTravelAgenda);
            const req = httpTestingController.expectOne(url);
            req.flush([addedTravelAgenda]);

            expect(result).toEqual([addedTravelAgenda]);

            // 2. Add empty Daily Trip
            service.addDailyTrip(result[0].id);
            expect(result[0].dailyTrips.length).toEqual(1);
            let dailyTrip = result[0].dailyTrips[0];
            expect(dailyTrip.travelAgenda.id).toEqual(result[0].id);

            // 3. Add TravelViewPoint
            service.addTravelViewPoint(viewPointData, dailyTrip.id);
            dailyTrip = result[0].dailyTrips[0];
            expect(dailyTrip.travelViewPoints.length).toEqual(1);
            expect(dailyTrip.travelViewPoints[0].viewPoint.name).toEqual('老大桥9');

            // 4. Add one more TravelViewPoint
            service.addTravelViewPoint(viewPointData_1, dailyTrip.id);
            dailyTrip = result[0].dailyTrips[0];

            expect(dailyTrip.travelViewPoints.length).toEqual(2);
            expect(dailyTrip.travelViewPoints[0].viewPoint.name).toEqual('老大桥9');
            expect(dailyTrip.travelViewPoints[0].distanceToNext).not.toEqual(-1);
            expect(dailyTrip.travelViewPoints[0].transportationToNext.name).toEqual('Bus');

            expect(dailyTrip.travelViewPoints[1].viewPoint.name).toEqual('老大桥10');
            expect(dailyTrip.travelViewPoints[1].distanceToNext).toEqual(-1);
            expect(dailyTrip.travelViewPoints[1].transportationToNext).toEqual(null);

            // 4. Get TravelViewPoint by id
            const tvp = service.travelViewPointById(dailyTrip.travelViewPoints[0].id);
            expect(tvp.viewPoint.name).toEqual('老大桥9');
            expect(tvp.distanceToNext).not.toEqual(-1);
            expect(tvp.transportationToNext.name).toEqual('Bus');

            // 5. Add with no exist id
            expect(() => {
                service.addDailyTrip('noExist');
            }).toThrowError(/TravelAgenda Id/);
            expect(() => {
                service.addTravelViewPoint(viewPointData, 'noExist');
            }).toThrowError(/DailyTrip Id/);
        });
        it('#add() with backend error', () => {
            const addedTravelAgenda = Object.assign({}, travelAgendaData, { dailyTrips: [] });

            service.add(addedTravelAgenda);
            const req = httpTestingController.expectOne(url);
            req.flush('error happened', errorData);

            expect(error.network).toBeFalsy();
            expect(result).toEqual([addedTravelAgenda]);
            expect(dirtyIds.travelAgendas.created.length).toEqual(1);
            expect(dirtyIds.travelAgendas.created[0]).toEqual(result[0].id);
        });
        it('#add() with network error', () => {
            const addedTravelAgenda = Object.assign({}, travelAgendaData, { dailyTrips: [] });

            service.add(addedTravelAgenda);
            const req = httpTestingController.expectOne(url);
            req.error(new ErrorEvent('network error'));

            expect(error.network).toBeTruthy();
            expect(result).toEqual([addedTravelAgenda]);
            expect(dirtyIds.travelAgendas.created.length).toEqual(1);
            expect(dirtyIds.travelAgendas.created[0]).toEqual(result[0].id);
        });
    });

    describe('change test', () => {
        beforeEach(() => {
            service.add(travelAgendaData);
            const req = httpTestingController.expectOne(url);

            req.flush([travelAgendaData]);
        });

        it('#change()', () => {
            const changedTravelAgenda = Object.assign({}, travelAgendaData, { name: '黄山1' });
            service.change(changedTravelAgenda);
            const req = httpTestingController.expectOne(url);
            req.flush([changedTravelAgenda]);

            expect(result[0].name).toEqual('黄山1');
        });
        it('#change() with backend error', () => {
            const changedTravelAgenda = Object.assign({}, travelAgendaData, { name: '黄山1' });
            service.change(changedTravelAgenda);
            const req = httpTestingController.expectOne(url);
            req.flush('error happened', errorData);

            expect(error.network).toBeFalsy();
            expect(result[0].name).toEqual('黄山1');
            expect(dirtyIds.travelAgendas.created.length).toEqual(0);
            expect(dirtyIds.travelAgendas.updated.length).toEqual(1);
            expect(dirtyIds.travelAgendas.updated[0]).toEqual(result[0].id);
        });
        it('#change() with network error', () => {
            const changedTravelAgenda = Object.assign({}, travelAgendaData, { name: '黄山1' });
            service.change(changedTravelAgenda);
            const req = httpTestingController.expectOne(url);
            req.error(new ErrorEvent('network error'));

            expect(error.network).toBeTruthy();
            expect(result[0].name).toEqual('黄山1');
            expect(dirtyIds.travelAgendas.deleted.length).toEqual(0);
            expect(dirtyIds.travelAgendas.updated.length).toEqual(1);
            expect(dirtyIds.travelAgendas.updated[0]).toEqual(result[0].id);
        });
    });

    describe('delete test', () => {
        beforeEach(() => {
            service.add(travelAgendaData);
            const req = httpTestingController.expectOne(url);

            req.flush([travelAgendaData]);
        });

        it('#delete()', () => {
            service.remove(travelAgendaData);
            const req = httpTestingController.expectOne(`${url}/${travelAgendaData.id}`);
            req.flush([travelAgendaData]);

            expect(result).toEqual([]);
        });
        it('#delete() with backend error', () => {
            service.remove(travelAgendaData);
            const req = httpTestingController.expectOne(`${url}/${travelAgendaData.id}`);
            req.flush('error happened', errorData);

            expect(error.network).toBeFalsy();
            expect(result).toEqual([]);
            expect(dirtyIds.travelAgendas.created.length).toEqual(0);
            expect(dirtyIds.travelAgendas.deleted.length).toEqual(1);
            expect(dirtyIds.travelAgendas.deleted[0]).toEqual(travelAgendaData.id);
        });
        it('#delete() with network error', () => {
            service.remove(travelAgendaData);
            const req = httpTestingController.expectOne(`${url}/${travelAgendaData.id}`);
            req.error(new ErrorEvent('network error'));

            expect(error.network).toBeTruthy();
            expect(result).toEqual([]);
            expect(dirtyIds.travelAgendas.updated.length).toEqual(0);
            expect(dirtyIds.travelAgendas.deleted.length).toEqual(1);
            expect(dirtyIds.travelAgendas.deleted[0]).toEqual(travelAgendaData.id);
        });
    });
});
