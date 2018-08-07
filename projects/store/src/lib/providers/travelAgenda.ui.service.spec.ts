import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { initTest } from '../../../../test';
import { ICityBiz } from '../bizModel/model/city.biz.model';
import { IDailyTripBiz, ITravelAgendaBiz, ITravelViewPointBiz } from '../bizModel/model/travelAgenda.biz.model';
import { IViewPointBiz, IViewPointCategoryBiz } from '../bizModel/model/viewPoint.biz.model';
import { ITransportationCategory } from '../entity/model/travelAgenda.model';
import { ErrorService } from './error.service';
import { TravelAgendaService } from './travelAgenda.service';
import { TravelAgendaUIService } from './travelAgenda.ui.service';
import { ViewPointService } from './viewPoint.service';

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

const noExist: ITravelAgendaBiz = {
    id: 'noExist',
    name: 'noExist',
    user: 'whoiscxt',
    cover: 'assets/img/IMG_4201.jpg',
    dailyTrips: []
};

travelViewPointData.dailyTrip = dailyTripData;
dailyTripData.travelAgenda = travelAgendaData;

let travelAgendaSrv: TravelAgendaService;
let travelAgendaUISrv: TravelAgendaUIService;
let viewPointService: ViewPointService;
let errorService: ErrorService;
let httpTestingController: HttpTestingController;

let error, result, searched;

describe('travelAgenda ui test', () => {
    beforeEach(async () => {
        await initTest();

        httpTestingController = TestBed.get(HttpTestingController);
        travelAgendaSrv = TestBed.get(TravelAgendaService);
        travelAgendaUISrv = TestBed.get(TravelAgendaUIService);
        errorService = TestBed.get(ErrorService);
        viewPointService = TestBed.get(ViewPointService);

        errorService.lastError$.subscribe((value) => {
            error = value;
        });
        travelAgendaSrv.selected$.subscribe((value) => {
            result = value;
        });
        travelAgendaSrv.searched$.subscribe((value) => {
            searched = value;
        });

        viewPointService.fetch();
        let req = httpTestingController.expectOne('http://localhost:3000/viewPoints');
        req.flush([viewPointData]);

        travelAgendaSrv.add(travelAgendaData);
        req = httpTestingController.expectOne('http://localhost:3000/travelAgendas');
        req.flush([travelAgendaData]);
    });

    describe('select test', () => {
        it('#select()', () => {
            travelAgendaUISrv.select(travelAgendaData);

            expect(travelAgendaSrv.selected).toEqual(travelAgendaData);
            expect(result).toEqual(travelAgendaData);
        });

        it('#select() not exist', () => {
            travelAgendaUISrv.select(noExist);
            expect(travelAgendaSrv.selected).toEqual(null);
            expect(result).toEqual(null);
        });
    });

    describe('search test', () => {
        it('#search()', () => {
            travelAgendaUISrv.search('黄山');
            expect(travelAgendaUISrv.searchKey).toEqual('黄山');
            expect(searched[0].name).toEqual('黄山');
        });

        it('#search() no exist', () => {
            travelAgendaUISrv.search('noExist');

            expect(travelAgendaUISrv.searchKey).toEqual('noExist');
            expect(searched).toEqual([]);
        });
    });
});
