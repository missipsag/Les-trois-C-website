    
module.exports.SQL_CREATE_USER_TABLE = "   CREATE TABLE  IF NOT EXISTS users ("
    + "userId varchar(255) UNIQUE PRIMARY KEY NOT NULL,"
    + "firstName varchar(255) NOT NULL ,"
    + "lastName varchar(255) NOT NULL,"
    + "email varchar(255) NOT NULL,"
    + "phone varchar(255),"
    + "role ENUM ('user', 'admin')"
    + ");";

