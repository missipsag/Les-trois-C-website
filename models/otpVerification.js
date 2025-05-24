exports.SQL_CREATE_OTP_VERIFICATION = "CREATE TABLE IF NOT EXISTS otpVerifications ( "
    + "verficationId varchar(255) NOT NULL PRIMARY KEY,"
    + "email varchar(255) NOT NULL, "
    + "hashedOtpCode varchar(255) NOT NULL,"
    + "expiresAt DATETIME NOT NULL,"
    + "used BIT(1) NOT NULL"
    + ");";


