export function objectToQueryString(obj: Object) {
    const keys = Object.keys(obj);
    const keyValuePairs = keys.map(
      key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`
    );
    return keyValuePairs.join('&');
  }
