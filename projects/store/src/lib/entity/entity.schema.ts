import { schema } from 'normalizr';

import { STORE_ENTITIES_KEY } from './entity.model';

export const userSchema = new schema.Entity(STORE_ENTITIES_KEY.users);

export const citySchema = new schema.Entity(STORE_ENTITIES_KEY.cities);

export const viewPointCommentSchema = new schema.Entity(STORE_ENTITIES_KEY.viewPointComments);

export const viewPointCategorySchema = new schema.Entity(STORE_ENTITIES_KEY.viewPointCatgories);

export const viewPointSchema = new schema.Entity(STORE_ENTITIES_KEY.viewPoints, {
    comments: [viewPointCommentSchema],
    city: citySchema,
    category: viewPointCategorySchema
});

export const filterCriteriaSchema = new schema.Entity(STORE_ENTITIES_KEY.filterCriteries);

export const filterCategorySchema = new schema.Entity(STORE_ENTITIES_KEY.filterCategories, {
    criteries: [filterCriteriaSchema]
});

export const transportationCategorySchema = new schema.Entity(STORE_ENTITIES_KEY.transportationCatgories);

export const travelViewPointSchema = new schema.Entity(STORE_ENTITIES_KEY.travelViewPoints, {
    viewPoint: viewPointSchema,
    transportationToNext: transportationCategorySchema
});

export const dailyTripSchema = new schema.Entity(STORE_ENTITIES_KEY.dailyTrips, {
    travelViewPoints: [travelViewPointSchema],
    lastViewPoint: travelViewPointSchema
});

export const travelAgendaSchema = new schema.Entity(STORE_ENTITIES_KEY.travelAgendas, {
    dailyTrips: [dailyTripSchema]
});

dailyTripSchema.define({ 'travelAgenda': travelAgendaSchema });
travelViewPointSchema.define({ 'dailyTrip': dailyTripSchema });
