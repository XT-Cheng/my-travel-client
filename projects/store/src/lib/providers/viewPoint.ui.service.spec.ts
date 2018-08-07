import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { initTest } from '../../../../test';
import { FilterTypeEnum, IFilterCategoryBiz } from '../bizModel/model/filterCategory.biz.model';
import { IViewPointBiz } from '../bizModel/model/viewPoint.biz.model';
import { ErrorService } from './error.service';
import { FilterCategoryService } from './filterCategory.service';
import { ViewPointService } from './viewPoint.service';
import { ViewPointUIService } from './viewPoint.ui.service';

const url = 'http://localhost:3000/viewPoints';

const filterCategoryData: IFilterCategoryBiz = {
    id: '5a4b4d6030e1cf2b19b493d8',
    filterType: FilterTypeEnum.ViewPoint,
    name: '类型',
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
};

const noExist: IViewPointBiz = {
    city: null,
    name: '老街',
    category: null,
    tags: [],
    description: '朱家角',
    tips: '老大桥测试OK，完全好玩不过但是。',
    timeNeeded: '1-2小时',
    address: '黄山中路888号',
    latitude: 29.8,
    longtitude: 118.3,
    rank: 4.5,
    thumbnail: 'assets/img/IMG_4201.jpg',
    comments: [],
    countOfComments: 11,
    images: [],
    id: 'noexist'
};

const viewPointData: IViewPointBiz = {
    city: {
        addressCode: '341000',
        name: '黄山2',
        thumbnail: 'assets/img/alan.png',
        id: '5a4b5756764fba2c80ef5ba1'
    },
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

const searchData: IViewPointBiz = Object.assign({}, viewPointData, {
    name: 'Search',
    id: '5a4912502350c4065c30ssss'
});

let viewPointSrv: ViewPointService;
let viewPointUISrv: ViewPointUIService;
let filterCategorySrv: FilterCategoryService;
let errorService: ErrorService;
let httpTestingController: HttpTestingController;

let error, result, searched, filtered, filteredAndSearched;

describe('viewPoint ui test', () => {
    beforeEach(async () => {
        await initTest();

        httpTestingController = TestBed.get(HttpTestingController);
        viewPointSrv = TestBed.get(ViewPointService);
        viewPointUISrv = TestBed.get(ViewPointUIService);
        errorService = TestBed.get(ErrorService);
        filterCategorySrv = TestBed.get(FilterCategoryService);

        errorService.lastError$.subscribe((value) => {
            error = value;
        });
        viewPointSrv.selected$.subscribe((value) => {
            result = value;
        });
        viewPointSrv.searched$.subscribe((value) => {
            searched = value;
        });
        viewPointSrv.filtered$.subscribe((value) => {
            filtered = value;
        });
        viewPointSrv.filteredAndSearched$.subscribe((value) => {
            filteredAndSearched = value;
        });

        filterCategorySrv.add(filterCategoryData);
        let req = httpTestingController.expectOne('http://localhost:3000/filterCategories');
        req.flush([filterCategoryData]);

        viewPointSrv.add(viewPointData);
        req = httpTestingController.expectOne(url);
        req.flush([viewPointData, searchData]);
    });

    describe('select test', () => {
        it('#select()', () => {
            viewPointUISrv.select(viewPointData);

            expect(viewPointSrv.selected).toEqual(viewPointData);
            expect(result).toEqual(viewPointData);
        });

        it('#select() not exist', () => {
            viewPointUISrv.select(noExist);

            expect(viewPointSrv.selected).toEqual(null);
            expect(result).toEqual(null);
        });
    });

    describe('search test', () => {
        it('#search()', () => {
            viewPointUISrv.search('Search');

            expect(viewPointUISrv.searchKey).toEqual('Search');
            expect(searched).toEqual([searchData]);
        });

        it('#search() no exist', () => {
            viewPointUISrv.search('noExist');

            expect(viewPointUISrv.searchKey).toEqual('noExist');
            expect(searched).toEqual([]);
        });
    });

    describe('filter test', () => {
        it('#filter()', () => {
            viewPointUISrv.filter('5a4b4d6030e1cf2b19b493da');

            expect(filtered).toEqual([viewPointData, searchData]);
        });

        it('#filter() no exist', () => {
            viewPointUISrv.filter('5a4b4d6030e1cf2b19b493d9');

            expect(filtered).toEqual([]);
        });
    });

    describe('filter and search test', () => {
        it('#filtered and searched', () => {
            viewPointUISrv.filter('5a4b4d6030e1cf2b19b493da');
            viewPointUISrv.search('Search');

            expect(filtered).toEqual([viewPointData, searchData]);
            expect(filteredAndSearched).toEqual([searchData]);
        });

        it('#filtered and searched, no exist', () => {
            viewPointUISrv.filter('5a4b4d6030e1cf2b19b493d9');
            viewPointUISrv.search('Search');

            expect(filtered).toEqual([]);
            expect(searched).toEqual([searchData]);
            expect(filteredAndSearched).toEqual([]);
        });
    });
});
