const bcrypt = require("bcryptjs");
const SALT_ROUND = 10;

const hashedPassword = async (password) => {
    try{
        return await bcrypt.hash(password,SALT_ROUND);
    }
    catch(err){
        throw new Error(err.message);
    }
};

const comparePassword = async (password,userpassword) => {
    try{
        return bcrypt.compare(password, userpassword);
    }
    catch(err){
        throw new Error(err.message);
    }
}

module.exports = {hashedPassword,comparePassword};