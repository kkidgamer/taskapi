const jwt= require('jsonwebtoken')

// load the secret key used to verify tokens(from env)
const JWT_SECRET=process.env.JWT_SECRET

// middle ware function
function auth(req,res,next){
    // we get the authorization header from the incoming request
    const authHeader=req.headers.authorization
    // console.log("authHeader",authHeader)
    const pToken=authHeader && authHeader.split(' ')[1]
    const token=pToken.replace('""','')
    
    if(!token)return res.status(401).json({message:"No token provided"})
        try {
            // verify the token using the secret key
            // if token is valid decode it and store the user in req.user           

            const decode=jwt.verify(token,JWT_SECRET)
            console.log("decode ",decode)
            req.user=decode
            // allow the request to proceed to the next route handler
            next()
        } catch (error) {
            res.status(403).json({message:error.message})
        }
}

module.exports=auth