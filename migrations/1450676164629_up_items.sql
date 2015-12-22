create table items (
    id integer,
    by varchar(1024),
    text text,
    time timestamp,
    type varchar(256),
    parent integer,
    kids text,
    url varchar(512),
    title varchar(1024),
    score integer
);
