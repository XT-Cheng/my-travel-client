import { IEntity } from '../entity.model';

export interface IViewPointCategory extends IEntity {
    name: string;
}

export interface IViewPoint extends IEntity {
    city: string;
    name: string;
    description: string;
    tips: string;
    timeNeeded: string;
    thumbnail: string;
    address: string;
    latitude: number;
    longtitude: number;
    category: string;
    rank: number;
    countOfComments: number;
    images: string[];
    tags: string[];
    comments: string[];
}

export interface IViewPointComment extends IEntity {
    detail: string;
    user: string;
    avatar: string;
    publishedAt: Date;
    images: string[];
    rate: number;
}
