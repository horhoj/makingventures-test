import { Filter, Message } from './types';

type Rules = {
  [K in Filter['type']]: (
    params: Extract<Filter, { type: K }>,
    message: Message,
  ) => boolean;
};

const rules: Rules = {
  string({ field, operation, value }, message): boolean {
    const msgValue = message[field];

    if (typeof msgValue !== 'string') {
      return false;
    }

    if (operation === 'eq') {
      return msgValue === value;
    }

    if (operation === 'startsWith') {
      return msgValue.slice(0, value.length) === value;
    }

    if (operation === 'endsWith') {
      return msgValue.slice(-value.length) === value;
    }

    if (operation === 'contains') {
      return msgValue.includes(value);
    }

    return false;
  },

  number({ field, operation, value }, message): boolean {
    const msgValue = message[field];
    if (typeof msgValue !== 'number') {
      return false;
    }

    if (operation === 'eq') {
      return msgValue === value;
    }

    if (operation === 'gt') {
      return msgValue > value;
    }

    if (operation === 'gte') {
      return msgValue >= value;
    }

    if (operation === 'lt') {
      return msgValue < value;
    }

    if (operation === 'lte') {
      return msgValue <= value;
    }

    return false;
  },

  boolean({ field, operation, value }, message): boolean {
    const msgValue = message[field];
    if (typeof msgValue !== 'boolean') {
      return false;
    }

    if (operation === 'eq') {
      return message[field] === value;
    }

    return false;
  },

  date({ field, operation, value }, message): boolean {
    const msgValue = message[field];
    if (typeof msgValue !== 'string' && !(msgValue instanceof Date)) {
      return false;
    }

    if (operation === 'eq') {
      return new Date(msgValue).getTime() === new Date(value).getTime();
    }

    if (operation === 'after') {
      return new Date(msgValue).getTime() < new Date(value).getTime();
    }

    if (operation === 'before') {
      return new Date(msgValue).getTime() > new Date(value).getTime();
    }

    return false;
  },

  or({ filters }, message): boolean {
    for (const options of filters) {
      const result = runner(options.type, options, message);
      if (result === true) {
        return true;
      }
    }
    return false;
  },

  and({ filters }, message): boolean {
    for (const options of filters) {
      const result = runner(options.type, options, message);
      if (result === false) {
        return false;
      }
    }
    return true;
  },
};

function runner<
  TKey extends keyof Rules,
  TValue extends Parameters<Rules[TKey]>[0],
>(key: TKey, value: TValue, message: Message) {
  return rules[key](value, message);
}

export const filterMessages = (messages: Message[], options: Filter) => {
  const result = messages.filter((message) =>
    runner(options.type, options, message),
  );

  return result;
};
