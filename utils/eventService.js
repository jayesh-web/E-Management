class EventService {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
  
    filter() {
      console.log("queryString ", this.queryString);
      //---------FILTERING-------
      const queryObject = { ...this.queryString };
      console.log("queryobject", queryObject);
      const exculdeFields = ["sort", "fields", "page", "limit", "search"];
  
      exculdeFields.forEach((el) => delete queryObject[el]);
  
      console.log("after exclude", queryObject);
  
      //----------ADVANCE FILTERING------------
      let queryStr = JSON.stringify(queryObject);
      const keyMapping = {
        ltprice: "$lte",
        gtprice: "$gte",
      };
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  
      //   let data= JSON.parse(queryStr);
      //   let obj ={};
      //   Object.keys(data).forEach((key) => {
      //     obj = {...obj,[keyMapping[key]]:data[key]}
  
      //   });
      //   console.log("obj",{price:obj})
      //   this.query.find({price:obj});
  
      // if(this.queryString.category){
      //   this.query.find({
      //     include:[
      //       {
      //         model:'event_category',
      //         attributes:['category'],
      //         where:JSON.parse(queryStr)
      //       }
      //     ]
      //   })
      // }
      // this.query.find({
      //   "category.category": this.queryString.category
      // });
      // console.log("qqqqqq",JSON.parse(queryStr))
  
      // if (this.queryString.category) {
      //   this.query.find({
      //     include: [
      //       {
      //         model: "event_category",
      //         attributes: ["category"],
      //         where: JSON.parse(queryStr),
      //       },
      //     ],
      //   });
      // }
      // this.query.aggregate([
      //   {
      //     $lookup: {
      //       from: "event_category",
      //       localField: "category",
      //       foreignField: "_id",
      //       as: "category",
      //     },
      //   },
      // ]);
      this.query.find(JSON.parse(queryStr));
      return this;
    }
  
    sort() {
      //-----------SORTING-------------
      if (this.queryString.sort) {
        console.log("sort");
        const sortBy = this.queryString.sort.split(",").join(" ");
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort("name");
      }
      return this;
    }
  
    limitFields() {
      //-----------FIELD LIMITING-----------
  
      if (this.queryString.fields) {
        const fields = this.queryString.fields.split(",").join(" ");
        this.query = this.query.select(fields);
      } else {
        this.query.select("-__v");
      }
      return this;
    }
  
    paginate() {
      //-------PAGINATION-------------\
  
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 100;
      const skip = (page - 1) * limit;
  
      this.query = this.query.skip(skip).limit(limit);
      return this;
      // if (this.queryString.page) {
      //   const employeeCount = await Employee.countDocuments();
      //   if (skip >= employeeCount) throw new Error("This page does not exist");
      // }
    }
  
    search() {
      //-----------SEARCHING-----------
      console.log("this=>", this.queryString.search);
      if (this.queryString.search) {
        this.query = this.query.find({
          $or: [
            { name: { $regex: this.queryString.search.trim(), $options: "i" } },
          ],
        });
      }
      return this;
    }
  }
  
  module.exports = EventService;
  