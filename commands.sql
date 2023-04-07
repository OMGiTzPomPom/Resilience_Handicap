DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT(10) AUTO_INCREMENT, 
    first_name VARCHAR (255), 
    last_name VARCHAR (255),
    license_1 VARCHAR (7) UNIQUE,
    license_2 VARCHAR (7) UNIQUE NULL,
    is_disabled TINYINT (1),
    _days JSON,
    until DATE,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

INSERT INTO users (first_name, last_name, license_1, license_2, is_disabled, _days, until) 
VALUES ("John", "Doe", "AED44Z2", "", 0, '{
    "Monday": "a",
    "Tuesday": "b",
    "Wednesday": "b",
    "Thursday": "c",
    "Friday": "c",
    "Saturday": "b",
    "Sunday": "c"
}', "2024-12-28");

INSERT INTO users (first_name, last_name, license_1, license_2, is_disabled, _days, until) 
VALUES ("Pauline", "Srifi", "DD301A4", "JNBCG08", 1, '{
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
VALUES ("Baptiste", "Bilebault", "G8ADS88", "", 0, '{
    "Monday": "a",
    "Tuesday": "b",
    "Wednesday": "b",
    "Thursday": "c",
    "Friday": "c",
    "Saturday": "b",
    "Sunday": "c"
}', "2024-12-28");

INSERT INTO users (first_name, last_name, license_1, license_2, is_disabled, _days, until) 
VALUES ("Adam", "Oumarov", "AD707Z0", "", 0, '{
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
    _number CHAR (1),
    area CHAR (1), 
    taken_by INT(10) NULL
) ENGINE=InnoDB;

INSERT INTO parking (_number, area, taken_by) 
VALUES ("0", "a", NULL);
INSERT INTO parking (_number, area, taken_by) 
VALUES ("1", "a", NULL);
INSERT INTO parking (_number, area, taken_by) 
VALUES ("2", "a", NULL);
INSERT INTO parking (_number, area, taken_by) 
VALUES ("3", "a", NULL);
INSERT INTO parking (_number, area, taken_by) 
VALUES ("4", "a", NULL);
INSERT INTO parking (_number, area, taken_by) 
VALUES ("5", "a", NULL);
INSERT INTO parking (_number, area, taken_by) 
VALUES ("6", "a", NULL);
INSERT INTO parking (_number, area, taken_by) 
VALUES ("7", "a", NULL);
INSERT INTO parking (_number, area, taken_by) 
VALUES ("8", "a", NULL);
INSERT INTO parking (_number, area, taken_by) 
VALUES ("9", "a", NULL);

INSERT INTO parking (_number, area, taken_by) 
VALUES ("0", "b", NULL);
INSERT INTO parking (_number, area, taken_by) 
VALUES ("1", "b", NULL);
INSERT INTO parking (_number, area, taken_by) 
VALUES ("2", "b", NULL);
INSERT INTO parking (_number, area, taken_by) 
VALUES ("3", "b", NULL);
INSERT INTO parking (_number, area, taken_by) 
VALUES ("4", "b", NULL);
INSERT INTO parking (_number, area, taken_by) 
VALUES ("5", "b", NULL);
INSERT INTO parking (_number, area, taken_by) 
VALUES ("6", "b", NULL);
INSERT INTO parking (_number, area, taken_by) 
VALUES ("7", "b", NULL);
INSERT INTO parking (_number, area, taken_by) 
VALUES ("8", "b", NULL);
INSERT INTO parking (_number, area, taken_by) 
VALUES ("9", "b", NULL);

INSERT INTO parking (_number, area, taken_by) 
VALUES ("0", "c", NULL);
INSERT INTO parking (_number, area, taken_by) 
VALUES ("1", "c", NULL);
INSERT INTO parking (_number, area, taken_by) 
VALUES ("2", "c", NULL);
INSERT INTO parking (_number, area, taken_by) 
VALUES ("3", "c", NULL);
INSERT INTO parking (_number, area, taken_by) 
VALUES ("4", "c", NULL);
INSERT INTO parking (_number, area, taken_by) 
VALUES ("5", "c", NULL);
INSERT INTO parking (_number, area, taken_by) 
VALUES ("6", "c", NULL);
INSERT INTO parking (_number, area, taken_by) 
VALUES ("7", "c", NULL);
INSERT INTO parking (_number, area, taken_by) 
VALUES ("8", "c", NULL);
INSERT INTO parking (_number, area, taken_by) 
VALUES ("9", "c", NULL);