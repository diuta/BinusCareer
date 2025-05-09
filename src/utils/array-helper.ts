export function arrayAreEqual(arr1: string[], arr2: string[]) {
    return (
      arr1.length === arr2.length &&
      arr1.every((value, index) => value === arr2[index])
    );
}