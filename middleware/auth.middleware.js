import jwt from 'jsonwebtoken'

export const requireAuth = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth) {
        res.status(401).json({error : 'No token provided'})
    }

    const token = auth.split(' ')[1];
    try {
        const {userId} = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = userId;
        next();
    } catch (error) {
        res.status(401).json({error : 'Invalid token'});
    }
}