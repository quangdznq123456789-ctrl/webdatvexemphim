
USE web_dat_ve;
GO

CREATE TABLE movies (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    genre NVARCHAR(255),
    duration INT,
    release_date DATE,
    image NVARCHAR(500)
);
GO