const {JWT_EXP,JWT_SEC,MONGO_URL} = process.env;

module.exports = {
    JWT_SECRET:JWT_SEC,
    MONGO_URI:MONGO_URL,
    JWT_EXPIRATION:JWT_EXP
}