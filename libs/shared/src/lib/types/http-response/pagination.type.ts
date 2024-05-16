export interface PaginationResponse<T> {
  /**
   * @description Paginated Data
   */
  data: T[];
  /**
   * @description Current page
   */
  page: number;
  /**
   * @description Total number of pages
   */
  pages: number;
  /**
   * @description Number of row to be returned
   */
  limit: number;
  /**
   * @description Total number of items
   */
  items: number;
}
