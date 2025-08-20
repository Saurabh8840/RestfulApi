//ye ek high order function hai jo function ke under fucntion return karta hia dost


const asyncHandler=(requestHandler)=>{

    return async(req,res,next)=>{
      Promise.resolve(
        requestHandler(req,res,next)).catch((err)=>next(err)
    )
    }
}

export {asyncHandler}


