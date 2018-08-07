import { ObjectID } from 'bson';

import { IBiz } from '../biz.model';

export interface ICityBiz extends IBiz {
    id: string;
    name: string;
    thumbnail: string;
    addressCode: string;
}

export function newCity(): ICityBiz {
    return {
        id: new ObjectID().toHexString(),
        name: '',
        addressCode: '',
        thumbnail: ''
    };
}
