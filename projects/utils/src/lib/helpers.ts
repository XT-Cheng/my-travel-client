export const deepExtend = function(...objects: any[]): any {
  if (arguments.length < 1 || typeof arguments[0] !== 'object') {
    return false;
  }

  if (arguments.length < 2) {
    return arguments[0];
  }

  const target = arguments[0];

  // convert arguments to array and cut off target object
  const args = Array.prototype.slice.call(arguments, 1);

  let val, src;

  args.forEach(function(obj: any) {
    // skip argument if it is array or isn't object
    if (typeof obj !== 'object' || Array.isArray(obj)) {
      return;
    }

    Object.keys(obj).forEach(function(key) {
      src = target[key]; // source value
      val = obj[key]; // new value

      // recursion prevention
      if (val === target) {
        return;

        /**
         * if new value isn't object then just overwrite by new value
         * instead of extending.
         */
      } else if (typeof val !== 'object' || val === null) {
        target[key] = val;

        return;

        // just clone arrays (and recursive clone objects inside)
      } else if (Array.isArray(val)) {
        target[key] = deepCloneArray(val);

        return;

        // custom cloning and overwrite for specific objects
      } else if (isSpecificValue(val)) {
        target[key] = cloneSpecificValue(val);

        return;

        // overwrite by new value if source isn't object or array
      } else if (
        typeof src !== 'object' ||
        src === null ||
        Array.isArray(src)
      ) {
        target[key] = deepExtend({}, val);

        return;

        // source value and new value is objects both, extending...
      } else {
        target[key] = deepExtend(src, val);

        return;
      }
    });
  });

  return target;
};

function isSpecificValue(val: any) {
  return val instanceof Date || val instanceof RegExp ? true : false;
}

function cloneSpecificValue(val: any): any {
  if (val instanceof Date) {
    return new Date(val.getTime());
  } else if (val instanceof RegExp) {
    return new RegExp(val);
  } else {
    throw new Error('cloneSpecificValue: Unexpected situation');
  }
}

export function cloneObject(obj): any {
  const clone = {};
  for (const i in obj) {
    if (obj[i] != null && typeof obj[i] === 'object') {
      clone[i] = cloneObject(obj[i]);
    } else {
      clone[i] = obj[i];
    }
  }
  return clone;
}

/**
 * Recursive cloning array.
 */
function deepCloneArray(arr: any[]): any {
  const clone: any[] = [];
  arr.forEach(function(item: any, index: any) {
    if (typeof item === 'object' && item !== null) {
      if (Array.isArray(item)) {
        clone[index] = deepCloneArray(item);
      } else if (isSpecificValue(item)) {
        clone[index] = cloneSpecificValue(item);
      } else {
        clone[index] = deepExtend({}, item);
      }
    } else {
      clone[index] = item;
    }
  });

  return clone;
}

// getDeepFromObject({result: {data: 1}}, 'result.data', 2); // returns 1
export function getDeepFromObject(
  object = {},
  name: string,
  defaultValue?: any,
) {
  const keys = name.split('.');
  // clone the object
  let level = deepExtend({}, object || {});
  keys.forEach(k => {
    if (level && typeof level[k] !== 'undefined') {
      level = level[k];
    } else {
      level = undefined;
    }
  });

  return typeof level === 'undefined' ? defaultValue : level;
}

export function urlBase64Decode(str: string): string {
  let output = str.replace(/-/g, '+').replace(/_/g, '/');
  switch (output.length % 4) {
    case 0: {
      break;
    }
    case 2: {
      output += '==';
      break;
    }
    case 3: {
      output += '=';
      break;
    }
    default: {
      throw new Error('Illegal base64url string!');
    }
  }
  return b64DecodeUnicode(output);
}

export function b64decode(str: string): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let output = '';

  str = String(str).replace(/=+$/, '');

  if (str.length % 4 === 1) {
    throw new Error(
      `'atob' failed: The string to be decoded is not correctly encoded.`,
    );
  }

  for (
    // initialize result and counters
    let bc = 0, bs: any, buffer: any, idx = 0;
    // get next character
    (buffer = str.charAt(idx++));
    // character found in table? initialize bit storage and add its ascii value;
    // tslint:disable-next-line:no-bitwise
    ~buffer &&
    ((bs = bc % 4 ? bs * 64 + buffer : buffer),
    // and if not first of each 4 characters,
    // convert the first 8 bits to one ascii character
    // tslint:disable-next-line:no-bitwise
    bc++ % 4)
      ? // tslint:disable-next-line:no-bitwise
        (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
      : 0
  ) {
    // try to find character in table (0-63, not found => -1)
    buffer = chars.indexOf(buffer);
  }
  return output;
}

// https://developer.mozilla.org/en/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
export function b64DecodeUnicode(str: any) {
  return decodeURIComponent(
    Array.prototype.map
      .call(b64decode(str), (c: any) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );
}

export function toInteger(value: any): number {
  return parseInt(`${value}`, 10);
}

export function toString(value: any): string {
  return value !== undefined && value !== null ? `${value}` : '';
}

export function getValueInRange(value: number, max: number, min = 0): number {
  return Math.max(Math.min(value, max), min);
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isNumber(value: any): value is number {
  return !isNaN(toInteger(value));
}

export function isInteger(value: any): value is number {
  return (
    typeof value === 'number' && isFinite(value) && Math.floor(value) === value
  );
}

export function isDefined(value: any): boolean {
  return value !== undefined && value !== null;
}

export function padNumber(value: number) {
  if (isNumber(value)) {
    return `0${value}`.slice(-2);
  } else {
    return '';
  }
}

export function regExpEscape(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
