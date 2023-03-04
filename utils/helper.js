exports.sendError= (res,error,status=401)=>{
console.log(error,console.trace());
res.status(status).json({error});
}