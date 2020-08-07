const passport = require('passport')
const jwtStrategy = require('passport-jwt').Strategy
const {ExtractJwt} = require('passport-jwt')

const configs = require('../configs/app.config')

const {SECRET_KEY} = require('../configs/app.config')
const {GetUserById} = require('../src/users/user.service')

passport.use(new jwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('authorization'),
    secretOrKey: SECRET_KEY
},async (payload, done) => {
    console.log("payload", payload)
    try {
        
        const user = await GetUserById(payload.payload)
        if (!user) return done(null, false)
        done(null, user)
    } catch (error) {
        return done(error, false)
    }
}))

const PassportRoleJWT = roles => {
    return async (req, res, next) => {
        await passport.authenticate('jwt', {session: false})

        let error = false

        if (roles.indexOf(configs.USER_ROLE_ENUM.ALL) === -1)
        {
            if (roles.indexOf(req.user.role) === -1) {
                error = true
            }
        }

        if (error) return res.status(401).json({
            error: {
                message: 'Bạn không có quyền thực hiện !'
            }
        })

        req.userId = req.user
        next()
    }
}

module.exports = PassportRoleJWT