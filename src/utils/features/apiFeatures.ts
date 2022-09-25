import { PAGE_SIZE, QUERY_DELETED_IGNORE } from '../constants';

export class ApiFeatures {
   query?: any;
   queryString?: any;
   constructor(query?: any, queryString?: any) {
      this.query = query;
      this.queryString = queryString;
   }

   getSizeAndCurrentPage() {
      const { pageSize = PAGE_SIZE, currentPage = 1 } = this.queryString;
      const SIZE = Number(pageSize);
      const CURRENT_PAGE: number = currentPage !== 1 ? Number(currentPage) : 0;

      return {
         CURRENT_PAGE,
         SIZE,
      };
   }

   paginating() {
      const { pageSize = PAGE_SIZE, currentPage = 1 } = this.queryString;
      const SIZE = Number(pageSize);
      const FROM = currentPage !== 1 ? Number(currentPage) : SIZE * 0;

      this.query = this.query.skip(FROM).limit(SIZE);
      return this;
   }

   counting() {
      const { typeCounting = QUERY_DELETED_IGNORE } = this.queryString;
      this.query = this.query.count({ ...typeCounting });
      return this;
   }
}
