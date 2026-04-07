import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env.js'
import User from '../models/user.model.js'

const authorize = async (req, res, next) => {
    try {
        let token

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer ')
        ) {
            token = req.headers.authorization.split(' ')[1]
        }

        if (!token)
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: No token provided',
            })

        console.log('Token:', token)
        //
        const decoded = jwt.verify(token, JWT_SECRET)

        const user = await User.findById(decoded.userId).select('-password')

        if (!user)
            return res
                .status(401)
                .json({ success: false, message: 'User not found' })

        req.user = user
        next()
    } catch (error) {
        const isDev = process.env.NODE_ENV === 'development'
        res.status(401).json({
            success: false,
            message: 'Unauthorized: Invalid token',
            ...(isDev && { error: error.message }),
        })
    }
}

const authorizeAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({
            success: false,
            message:
                'Access denied, only admins are allowed to access this resource',
        })
    }
    next()
}

export { authorize, authorizeAdmin }
