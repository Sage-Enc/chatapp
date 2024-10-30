import apiResponse from "./apiResponse";

class apiError extends Error{
    constructor(
        statusCode,
        message = "Something Went Wrong",
        error = [],
        stack = ""
    ){
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.data = null;
        this.error = error;
        this.success = false

        if(stack){
            this.stack = stack;
        }else{
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default apiResponse;