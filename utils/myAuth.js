const jwt = require('jsonwebtoken');
const token = jwt.sign({ foo: 'bar' }, 'secret',{expiresIn:60*60});
console.log("token.....",token)
//backdate a jwt 30 seconds
const older_token = jwt.sign({ foo: 'bar', iat: Math.floor(Date.now() / 1000) - 30 }, 'secret');
console.log("older token...",older_token)

const decoded = jwt.verify(token, 'secret',function(err,decoded){
    console.log("---> : ",err,decoded);
});