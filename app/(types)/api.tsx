export interface APIQueryResult<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
}
