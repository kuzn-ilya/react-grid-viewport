// tslint:disable-next-line:no-any
export function omit(obj: {[key: string]: any}, ...omitKeys: string[]): {[key: string]: any} {
    // tslint:disable-next-line:no-any
    return Object.keys(obj).reduce((result: {[key: string]: any}, key: string) => {
        if (omitKeys.every((value: string) => value !== key)) {
            result[key] = obj[key];
        }
        return result;
    }, {});
}