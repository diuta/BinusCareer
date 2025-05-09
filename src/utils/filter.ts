export function applyOrderedFilters(
    filterPayload: Object,
    filterOrder: string[],
    filterMappingData: object[]
  ) {
    const filterKeys = Object.keys(filterPayload);
  
    const filterForEachKeys: Object = filterKeys.reduce((acc, key) => {
      acc[key] = filterMappingData;
      return acc;
    }, {});
  
    const implementedFilter: string[] = [];
  
    filterOrder.forEach(filterName => {
      implementedFilter.push(filterName);
  
      const keysNeedToBeFiltered = filterKeys.filter(name => !implementedFilter.includes(name));
  
      keysNeedToBeFiltered.forEach(name => {
        filterForEachKeys[name] = filterForEachKeys[name].filter((mappingData: Object) =>
          filterPayload[filterName].includes(mappingData[filterName])
        );
      });
    });
  
    return Object.keys(filterForEachKeys).reduce((acc, key) => {
      acc[key] = filterForEachKeys[key].map((item: Object) => item[key]);
      return acc;
    }, {});
  }