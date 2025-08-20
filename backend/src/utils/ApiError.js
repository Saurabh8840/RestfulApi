// standardizing error in a format 

class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        error=[],
        stack=""
    ){
        super(message)
        this.statusCode=statusCode;
        this.data=null
        this.message=message;
        this.success=false;
        this.errors=error;
        
        //stack is to caputre error okk
        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}


// api error= custom error bana status code ,success,errors,data


