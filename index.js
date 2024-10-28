const bcrypts= require('bcryptjs');

const password = 'felipe123'

console.log(bcrypts.hashSync(password, 10));