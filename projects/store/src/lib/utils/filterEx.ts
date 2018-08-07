import { IFilterCriteriaBiz } from '../bizModel/model/filterCategory.biz.model';
import { IViewPointBiz } from '../bizModel/model/viewPoint.biz.model';

export class FilterEx {
    static filterByCategory(viewPoint: IViewPointBiz, criteria: IFilterCriteriaBiz): boolean {
        return viewPoint.category.name === criteria.criteria;
    }

    static filterByNeedTime(viewPoint: IViewPointBiz, criteria: IFilterCriteriaBiz): boolean {
        return viewPoint.timeNeeded === parseFloat(criteria.criteria);
    }
}
