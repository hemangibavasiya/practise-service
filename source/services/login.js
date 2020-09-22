const { loginValidation } = require('../common/validation')
const User = require('../model/user'),
bcrypt = require('bcryptjs'),
jwt = require('jsonwebtoken')
const {errorGanerator} = require('../common/errorHandlar')
const comCon = require('../constants/comCon')


const login = (body) => {
    return new Promise(async (resolve, reject) => {
        try {

            // validate body
            const { error } = loginValidation(body)
            if (error) return reject(errorGanerator(comCon.STATUS_400, error.details[0].message))

            // check user is exists
            const user = await User.findOne({ email: body.email})
            if(!user) return reject(errorGanerator(comCon.STATUS_400, comCon.MSG_INVALID_USER))

            // Compare password
            const validPass = await bcrypt.compare(body.password, user.password)
            if(!validPass) return reject(errorGanerator(comCon.STATUS_400, comCon.MSG_INVALID_PASSWORD))
            // check user assigned in  https://jwt.io/
            const token = jwt.sign({_id: user.email}, process.env.TOKEN_SECRET)

            return resolve(token)

        } catch (error) {
            return reject(error)
        }
    })
}

module.exports = {
    login
}