const catchAsync = (fn) => {
    return (req, res, next) => {
      fn(req, res, next).catch(next);
    };
  };

const catchNewAsync = (fn) => {
    return (req,res,nextfn) => {
  fn(req,res,nextfn).catch(nextfn);
};
}   
const catchSingle = (fn) => {
  return(req,res,nextsin)=>{
    fn(req,res,nextsin).catch(nextsin);
  };
}

const catchMulti = (fn) =>{
    return(req,res,nextMmulti) =>{
        fn(req,res,nextMmulti).catch(nextMmulti);
    }
}
  module.exports ={catchAsync,catchNewAsync,catchSingle,catchMulti}
 