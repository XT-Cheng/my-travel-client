import { IEntity } from '../entity.model';

export interface ITransportationCategory extends IEntity {
    name: string;
    isDefault: boolean;
}

export interface ITravelAgenda extends IEntity {
    name: string;
    user: string;
    cover: string;
    dailyTrips: string[];
}

export interface IDailyTrip extends IEntity {
    travelViewPoints: string[];
    travelAgenda: string;
}

export interface ITravelViewPoint extends IEntity {
    viewPoint: string;
    transportationToNext: string;
    dailyTrip: string;
}
