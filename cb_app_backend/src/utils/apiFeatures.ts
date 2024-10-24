import { Query } from "mongoose";

class APIFeatures {
  query: Query<any, any>;
  queryString: { [key: string]: any };

  constructor(query: APIFeatures["query"], queryString: APIFeatures["queryString"]) {
    this.query = query;
    this.queryString = queryString;
  }

  filter(): this {
    // 1-A) BASIC FILTERING
    const queryObj = { ...this.queryString }; // { difficulty:'easy', page:2, sort:'1', limit:20 }
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1-B) HANDLE MULTIPLE VALUES WITH $IN
    Object.keys(queryObj).forEach((key) => {
      if (queryObj[key].includes(",")) {
        queryObj[key] = { $in: queryObj[key].split(",") };
      }
    });

    // 1-C) ADVANCED QUERY
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // FILTER OBJ { difficulty: 'easy', duration: { $gte: 5 } }
    this.query.find(JSON.parse(queryStr));
    // let query = Tour.find(JSON.parse(queryStr));
    return this;
  }

  // 2- SORTING
  sort(): this {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  // 3- LIMIT FIELDS
  limitFields(): this {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else this.query = this.query.select("-__v");
    return this;
  }

  // 4- PAGINATE
  paginate(): this {
    const page = +this.queryString.page || 1;
    const limit = +this.queryString.limit || 100;
    const skip = (page - 1) * limit;
    // query = query.skip(2).limit(10)
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;

// build query
// // 1-A) BASIC FILTERING
// const queryObj = { ...req.query }; // { difficulty:'easy', page:2, sort:'1', limit:20 }
// console.log('queryObj before: ', queryObj);
// const excludedFields = ['page', 'sort', 'limit', 'fields'];
// excludedFields.forEach((el) => delete queryObj[el]);

// // 1-B) ADVANCED QUERY
// let queryStr = JSON.stringify(queryObj);
// queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

// // FILTER OBJ { difficulty: 'easy', duration: { $gte: 5 } }
// let query = Tour.find(JSON.parse(queryStr));

// 2-) SORTING
// if (req.query.sort) {
//   const sortBy = req.query.sort.split(',').join(' ');
//   console.log(sortBy);
//   query = query.sort(sortBy);
// } else {
//   query = query.sort('-createdAt');
// }

// 3) FIELD LIMITING
// if (req.query.fields) {
//   const fields = req.query.fields.split(',').join(' ');
//   console.log(fields); // query.select('name duration price') it will send back result that contains only these 3
//   query = query.select(fields);
// } else query = query.select('-__v');

// 4) PAGINATION
// const page = +req.query.page || 1;
// const limit = +req.query.limit || 100;
// console.log(page, limit);
// const skip = (page - 1) * limit;
// // query = query.skip(2).limit(10)
// query = query.skip(skip).limit(limit);
// if (req.query.page) {
//   const numTours = await Tour.countDocuments();
//   if (skip >= numTours) throw new Error('This page does not exists');
// }
