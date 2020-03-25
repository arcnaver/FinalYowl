-- Creating table and schema
CREATE SCHEMA yowl;
 
-- CREATE: sequence
CREATE SEQUENCE yowl.login_credentials_id_seq;

-- TABLE: Login and Profile Credentials
CREATE TABLE yowl.login_prof_credentials (
    id INTEGER NOT NULL DEFAULT nextval('yowl.login_credentials_id_seq') PRIMARY KEY,
    user_name VARCHAR(256) NOT NULL UNIQUE,
    user_password VARCHAR(256) NOT NULL,
    first_name VARCHAR(25) NOT NULL,
    last_name VARCHAR(25) NOT NULL
);

 
-- TABLE: User Profile
-- CREATE TABLE yowl.user_profile (    
--     id serial PRIMARY KEY,
--     first_name VARCHAR(25) NOT NULL,
--     last_name VARCHAR(25) NOT NULL,
--     login_credentials_id INTEGER NOT NULL,
--         CONSTRAINT login_credentials_id FOREIGN KEY (login_credentials_id)
--         REFERENCES yowl.login_credentials(id)    
-- );
 
-- Table: User Messages
CREATE TABLE yowl.user_messages (
    message_id serial PRIMARY KEY,
    user_login_id INTEGER NOT NULL,
        CONSTRAINT user_login_id FOREIGN KEY (user_login_id)
        REFERENCES yowl.login_prof_credentials(id),
    creation_time TIME NOT NULL,
    creation_date DATE NOT NULL,
    message_data VARCHAR
);


-- INSERT to login credentials
INSERT INTO yowl.login_prof_credentials(user_name, user_password, first_name, last_name)
    VALUES('tester', 1234, 'Testy', 'Testman');
-- INSERT to user profile
-- INSERT INTO yowl.user_profile(first_name, last_name, login_credentials_id)
--     VALUES('Testy', 'Testman', (SELECT id FROM yowl.login_credentials WHERE user_name = 'tester'));

-- DROP TABLES
DROP TABLE yowl.user_messages;
DROP TABLE yowl.user_profile;
DROP TABLE yowl.login_prof_credentials;
DROP SEQUENCE yowl.login_credentials_id_seq;

