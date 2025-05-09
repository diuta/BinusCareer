/* eslint-disable @typescript-eslint/no-explicit-any */

export type Api = {
    [x: string]: string;
  };
  
  export type Query = {
    search?: string;
    pageSize?: number;
    pageNumber?: number;
    order?: string;
    sortBy?: string;
  };
  