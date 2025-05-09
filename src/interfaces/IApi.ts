/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IApi {
    [x: string]: string;
  }
  
  /**
   * default response with continuation token paging
   *
   * __T__ : type of each item of result
   *
   * _Note : if possible, dont use any instead_
   */
  export declare interface IResponseListToken<T> {
    result: T[];
    continuationToken: any;
  }
  export declare interface IResponseListPaging<T> {
    result: T[];
    totalItem: number;
    totalPage: number;
  }
  