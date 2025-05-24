module.exports.SQL_CREATE_ROOMS_TABLE = "CREATE TABLE IF NOT EXISTS rooms ("
    + "roomId varchar(255) NOT NULL PRIMARY KEY,"
    + "roomName varchar(255) ,"
    + "capacity INTEGER NOT NULL, "
    + "type ENUM ('conference', 'wedding', 'special occasion'),"
    + "CHECK (capacity > 0) "
    + " );";
    