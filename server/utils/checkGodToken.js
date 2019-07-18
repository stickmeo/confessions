const jwt = require('jsonwebtoken')
const fs = require('fs')

module.exports = token => {
    let isValid = false
    jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
        if (data) {
            const godTokens = JSON.parse(fs.readFileSync('server/godTokens.json'))
            let tokenIndex = godTokens.indexOf(token)
            isValid = data.data===true&&(tokenIndex!==-1)
            if (tokenIndex!==-1) godTokens.splice(tokenIndex, 1)
            fs.writeFileSync('server/godTokens.json', JSON.stringify(godTokens))
        }
    })
    return isValid
}