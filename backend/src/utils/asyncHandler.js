const asyncHandler = (funcHandler) =>{
    return (req, res, next) => {
        Promise()
        .resolve(()=> funcHandler(req, res, next))
        .catch((err)=> next(err))
    }
}

export default asyncHandler;