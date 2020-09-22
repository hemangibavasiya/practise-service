const { registerValidation } = require('../common/validation')
const User = require('../model/user')
const bcrypt = require('bcryptjs')
const {errorGanerator} = require('../common/errorHandlar')
const comCon = require('../constants/comCon')

const registration = (body) => {
    return new Promise(async (resolve, reject) => {
        try {
            // validate body
            const { error } = registerValidation(body)
            if (error) return reject(errorGanerator(comCon.STATUS_400, error.details[0].message))

            // check email is exists
            const emailExist = await User.findOne({ email: body.email })
            if (emailExist) return reject(errorGanerator(comCon.STATUS_400, comCon.MSG_EMAIL_ALREADY_EXISTS))

            // hash password
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.password, salt)

            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            })
            const savedUser = await user.save()
            return resolve(savedUser)
        } catch (err) {
            return reject(err)
        }
    })
}

module.exports = {
    registration
}