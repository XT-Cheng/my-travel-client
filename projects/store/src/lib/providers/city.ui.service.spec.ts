import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { initTest } from '../../../../test';
import { ICityBiz } from '../bizModel/model/city.biz.model';
import { CityService } from './city.service';
import { CityUIService } from './city.ui.service';
import { ErrorService } from './error.service';

const url = 'http://localhost:3000/cities';

const noExist: ICityBiz = {
    addressCode: '341000',
    name: '黄山1',
    thumbnail: 'assets/img/alan.png',
    id: 'noExist'
};

const searchData: ICityBiz = {
    addressCode: '341000',
    name: 'Search',
    thumbnail: 'assets/img/alan.png',
    id: '5a4b5756764fba2c80ef5ba5'
};

const cityData: ICityBiz = {
    addressCode: '341000',
    name: '黄山2',
    thumbnail: 'assets/img/alan.png',
    id: '5a4b5756764fba2c80ef5ba1'
};

let citySrv: CityService;
let cityUISrv: CityUIService;
let errorService: ErrorService;
let httpTestingController: HttpTestingController;

let error, result, searched;

describe('city ui test', () => {
    beforeEach(async () => {
        await initTest();

        httpTestingController = TestBed.get(HttpTestingController);
        citySrv = TestBed.get(CityService);
        cityUISrv = TestBed.get(CityUIService);
        errorService = TestBed.get(ErrorService);

        errorService.lastError$.subscribe((value) => {
            error = value;
        });
        citySrv.selected$.subscribe((value) => {
            result = value;
        });
        citySrv.searched$.subscribe((value) => {
            searched = value;
        });

        citySrv.add(cityData);
        const req = httpTestingController.expectOne(url);
        req.flush([cityData, searchData]);
    });

    describe('select test', () => {
        it('#select()', () => {
            cityUISrv.select(cityData);

            expect(citySrv.selected).toEqual(cityData);
            expect(result).toEqual(cityData);
        });

        it('#select() not exist', () => {
            cityUISrv.select(noExist);

            expect(citySrv.selected).toEqual(null);
            expect(result).toEqual(null);
        });
    });

    describe('search test', () => {
        it('#search()', () => {
            cityUISrv.search('Search');

            expect(cityUISrv.searchKey).toEqual('Search');
            expect(searched).toEqual([searchData]);
        });

        it('#search() no exist', () => {
            cityUISrv.search('noExist');

            expect(cityUISrv.searchKey).toEqual('noExist');
            expect(searched).toEqual([]);
        });
    });
});
