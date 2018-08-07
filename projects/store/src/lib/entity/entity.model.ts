
import { ICity } from './model/city.model';
import { IFilterCategory, IFilterCriteria } from './model/filterCategory.model';
import { IDailyTrip, ITransportationCategory, ITravelAgenda, ITravelViewPoint } from './model/travelAgenda.model';
import { IUser } from './model/user.model';
import { IViewPointComment, IViewPoint, IViewPointCategory } from './model/viewPoint.model';

export enum EntityTypeEnum {
    CITY = 'CITY',
    VIEWPOINT = 'VIEWPOINT',
    USER = 'USER',
    FILTERCATEGORY = 'FILTERCATEGORY',
    TRAVELAGENDA = 'TRAVELAGENDA',
    DAILYTRIP = 'DAILYTRIP',
    TRAVELVIEWPOINT = 'TRAVELVIEWPOINT',
    VIEWPOINTCATEGORY = 'VIEWPOINTCATEGORY',
    TRANSPORTATIONCATEGORY = 'TRANSPORTATIONCATEGORY',
    MASTER_DATA = 'MASTER_DATA'
}

export enum STORE_ENTITIES_KEY {
    cities = 'cities',
    viewPoints = 'viewPoints',
    viewPointComments = 'viewPointComments',
    viewPointCatgories = 'viewPointCatgories',
    users = 'users',
    filterCategories = 'filterCategories',
    filterCriteries = 'filterCriteries',
    transportationCatgories = 'transportationCatgories',
    travelViewPoints = 'travelViewPoints',
    dailyTrips = 'dailyTrips',
    travelAgendas = 'travelAgendas'
}

export interface IEntity {
    id: string;
}

export interface IEntities {
    cities: { [id: string]: ICity };
    viewPoints: { [id: string]: IViewPoint };
    viewPointCatgories: { [id: string]: IViewPointCategory };
    viewPointComments: { [id: string]: IViewPointComment };
    users: { [id: string]: IUser };
    filterCategories: { [id: string]: IFilterCategory };
    filterCriteries: { [id: string]: IFilterCriteria };
    travelAgendas: { [id: string]: ITravelAgenda };
    travelViewPoints: { [id: string]: ITravelViewPoint };
    dailyTrips: { [id: string]: IDailyTrip };
    transportationCatgories: { [id: string]: ITransportationCategory };
}

export const INIT_ENTITY_STATE: IEntities = {
    cities: {},
    viewPoints: {},
    viewPointCatgories: {},
    viewPointComments: {},
    users: {},
    filterCategories: {},
    filterCriteries: {},
    travelAgendas: {},
    travelViewPoints: {},
    dailyTrips: {},
    transportationCatgories: {}
};

// {} |
