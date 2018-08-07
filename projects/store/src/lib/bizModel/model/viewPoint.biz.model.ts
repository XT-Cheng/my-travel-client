import { IBiz } from '../biz.model';
import { ICityBiz } from './city.biz.model';
import { ObjectID } from 'bson';

export interface IViewPointCategoryBiz extends IBiz {
    name: string;
}

export interface IViewPointBiz extends IBiz {
    name: string;
    city: ICityBiz;
    description: string;
    tips: string;
    timeNeeded: number;
    thumbnail: string;
    address: string;
    latitude: number;
    longtitude: number;
    category: IViewPointCategoryBiz;
    rank: number;
    countOfComments: number;
    images: string[];
    tags: string[];
    comments: IViewPointCommentBiz[];
}

export interface IViewPointCommentBiz extends IBiz {
    detail: string;
    user: string;
    avatar: string;
    publishedAt: Date;
    images: string[];
    rate: number;
}

export function newViewPoint(): IViewPointBiz {
    return {
        id: new ObjectID().toHexString(),
        name: '',
        city: null,
        description: '',
        tips: '',
        timeNeeded: 0,
        thumbnail: '',
        address: '',
        latitude: null,
        longtitude: null,
        category: null,
        rank: 0,
        countOfComments: 0,
        images: [],
        tags: [],
        comments: []
        };
}
