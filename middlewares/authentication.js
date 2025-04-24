function checkForAuthenticationCookie(cookieName){
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if(!tokenCookieValue){
            next();
        }
        
        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
            return next();
        } catch (error) {}
        return next();
 }
}
module.exports = {
    checkForAuthenticationCookie,
};