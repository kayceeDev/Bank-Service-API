class ApiFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    filter() {
      // filtering
      const queryObj = { ...this.queryString };
      const excludeFields = ['page', 'sort', 'limit', 'fields'];
      excludeFields.forEach(el => delete queryObj[el]);
  
      // Advanced filtering
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(get|gt|lte|lt)\b/g, match => `$${match}`);
      this.query = this.query.find(JSON.parse(queryStr));
      return this;
    }
  
    // Sorting
    sort() {
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort('-createdAt');
      }
      return this;
    }
  
    // field limiting (Projecting)
    limit() {
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v');
      }
      return this;
    }
  
    pagination() {
      // Pagination with page and Limit query
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;
  
      this.query = this.query.skip(skip).limit(limit);
      return this;
    }
  }
  
  module.exports = ApiFeatures;
  