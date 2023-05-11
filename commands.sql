DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id BIGINT(10) AUTO_INCREMENT, 
    first_name VARCHAR (255), 
    last_name VARCHAR (255),
    license_1 VARCHAR (7) UNIQUE,
    license_2 VARCHAR (7) NULL,
    is_disabled TINYINT (1),
    _days JSON,
    until DATE,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

INSERT INTO users (first_name, last_name, license_1, license_2, is_disabled, _days, until) 
VALUES ("John", "Doe", "AE444IJ", "", 0, '{
    "Monday": "a",
    "Tuesday": "b",
    "Wednesday": "b",
    "Thursday": "c",
    "Friday": "c",
    "Saturday": "b",
    "Sunday": "c"
}', "2024-12-28");

INSERT INTO users (first_name, last_name, license_1, license_2, is_disabled, _days, until) 
VALUES ("Pauline", "Srifi", "DD301OP", "JN457DE", 1, '{
    "Monday": "a",
    "Tuesday": "b",
    "Wednesday": "b",
    "Thursday": "c",
    "Friday": "c",
    "Saturday": "b",
    "Sunday": "c"
}', "2024-12-28");

INSERT INTO users (first_name, last_name, license_1, license_2, is_disabled, _days, until) 
VALUES ("Andranik", "Arakelov", "AE407RB", "", 0, '{
    "Monday": "a",
    "Tuesday": "b",
    "Wednesday": "b",
    "Thursday": "c",
    "Friday": "c",
    "Saturday": "b",
    "Sunday": "c"
}', "2024-12-28");

INSERT INTO users (first_name, last_name, license_1, license_2, is_disabled, _days, until) 
VALUES ("Baptiste", "Bilebault", "GS854SS", "", 0, '{
    "Monday": "a",
    "Tuesday": "b",
    "Wednesday": "b",
    "Thursday": "c",
    "Friday": "c",
    "Saturday": "b",
    "Sunday": "c"
}', "2024-12-28");

INSERT INTO users (first_name, last_name, license_1, license_2, is_disabled, _days, until) 
VALUES ("Adam", "Oumarov", "AD707ZO", "", 0, '{
    "Monday": "a",
    "Tuesday": "b",
    "Wednesday": "b",
    "Thursday": "c",
    "Friday": "c",
    "Saturday": "b",
    "Sunday": "c"
}', "2024-12-28");


DROP TABLE IF EXISTS parking;
CREATE TABLE parking (
    id BIGINT(10) AUTO_INCREMENT,
    number VARCHAR (255),
    area VARCHAR (255),
    is_disabled TINYINT (1),
    plate VARCHAR (7) NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

INSERT INTO parking (number, area, is_disabled, plate) 
VALUES ("0", "a", 0, "");

INSERT INTO parking (number, area, is_disabled, plate) 
VALUES ("1", "a", 1, "");

INSERT INTO parking (number, area, is_disabled, plate) 
VALUES ("0", "b", 0, "");

INSERT INTO parking (number, area, is_disabled, plate) 
VALUES ("1", "b", 1, "");

INSERT INTO parking (number, area, is_disabled, plate) 
VALUES ("0", "c", 0, "");

INSERT INTO parking (number, area, is_disabled, plate) 
VALUES ("1", "c", 1, "");