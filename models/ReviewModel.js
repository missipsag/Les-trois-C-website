module.exports.SQL_CREATE_REVIEW_TABLE = "CREATE TABLE IF NOT EXISTS reviews ("
    + "reviewId varchar(255) NOT NULL PRIMARY KEY,"
    + "roomId varchar(255) NOT NULL,"
    + "userId varchar(255) NOT NULL,"
    + "FOREIGN KEY (roomId) REFERENCES rooms(roomId),"
    + "FOREIGN KEY (userId) REFERENCES users(userId)"
    + ");";