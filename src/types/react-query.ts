/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    UseMutationOptions as UseMutationOptionsTanstack,
    UseQueryOptions as UseQueryOptionsTanstack,
  } from '@tanstack/react-query';
  import { AxiosError } from 'axios';
  
  export type UseMutationOptions<TData = unknown> = Omit<
    UseMutationOptionsTanstack<
      TData,
      AxiosError<{ isError: boolean; message: string; errorCode: string }>,
      unknown,
      unknown
    >,
    'mutationKey'
  >;
  
  export type UseQueryOptions<TData = unknown> = Omit<
    UseQueryOptionsTanstack<unknown, AxiosError, TData, any>,
    'queryKey' | 'queryFn' | 'initialData'
  > & {
    initialData?: () => undefined;
  };
  