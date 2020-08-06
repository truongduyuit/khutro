const passport = require('passport')
const jwtStrategy = require('passport-jwt').Strategy
const {ExtractJwt} = require('passport-jwt')

const {SECRET_KEY} = require('../configs/app.config')
const {GetUserById} = require('../src/users/user.service')

passport.use(new jwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('authorization'),
    secretOrKey: SECRET_KEY
},async (payload, done) => {
    try {
        const user = await GetUserById(payload.payload)
        if (!user) return done(null, false)
        done(null, user)
    } catch (error) {
        return done(error, false)
    }
}))

const PassportRoleJWT = role => {
    return async (req, res, next) => {
        const user = await passport.authenticate('jwt', {session: false})
        if (role !== 'all')
        {
            if (user.role != role) return res.status(401).json({
                error: {
                    message: 'Bạn không có quyền thực hiện !'
                }
            })
        }
        req.userId = user._id
        next()
    }
}

module.exports = PassportRoleJWT