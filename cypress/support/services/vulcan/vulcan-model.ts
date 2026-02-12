export interface VulcanResponse<T = unknown> {
  isError: boolean;
  errorCode?: string;
  errorDetails?: string;
  errorParams?: string[];
  dateTime: string;
  result?: T;
}
