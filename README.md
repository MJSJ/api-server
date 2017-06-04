# api-server (handlebars templating + RESTful API using MySQL, on Node.js)


Then at the Unix command line, or using Git Bash on Windows:
````
$ git clone https://github.com/MJSJ/api-server.git
$ cd api-server
$ npm install
$ npm start
````

先装mysql，跑后面的sql语句

只做了ajax的api接口，通过以下方式调用 
* `http:/localhost:3000/members`
* `http:/localhost:3000/members/100001`

## File structure

```
.
├── app-api
│   ├── routes
│       ├── routes-auth.js   #需要权限的接口，还没做完
│       └── routes-members.js
│   ├── app-api.js
│   ├── members.js
│   ├── cast-boolean.js
├── lib
│   └── lib.js
├── logs
├── models
│   ├── member.js
│   ├── modelerror.js
│   ├── team.js
│   ├── team-member.js
│   └── user.js
├─ app.js
├─ .env
├─ LICENSE
├─ package.json
└─ README.md
```



## Database schema

```sql

create database `api-server`;
use `api-server`;

create table Member (
  MemberId  integer unsigned not null auto_increment,
  Firstname text,
  Lastname  text,
  Email     text not null,
  Active    bit(1),
  primary key       (MemberId),
  unique  key Email (Email(24))
) engine=InnoDB charset=utf8 auto_increment=100001;

create table Team (
  TeamId integer unsigned not null auto_increment,
  Name   text not null,
  primary key (TeamId)
) engine=InnoDB charset=utf8 auto_increment=100001;

create table TeamMember (
  TeamMemberId integer unsigned not null auto_increment,
  MemberId     integer unsigned not null,
  TeamId       integer unsigned not null,
  JoinedOn     date not null,
  primary key            (TeamMemberId),
  key         MemberId   (MemberId),
  key         TeamId     (TeamId),
  unique key  TeamMember (MemberId,TeamId),
  constraint Fk_Team_TeamMember   foreign key (TeamId)   references Team   (TeamId),
  constraint Fk_Member_TeamMember foreign key (MemberId) references Member (MemberId)
) engine=InnoDB charset=utf8 auto_increment=100001;

create table User (
  UserId    integer unsigned not null auto_increment,
  Firstname text,
  Lastname  text,
  Email     text not null,
  Password  text,
  Role      text,
  primary key       (UserId),
  unique  key Email (Email(24))
) engine=InnoDB charset=utf8 auto_increment=100001;
```

## Test data

```sql
-- Test data for ‘koa-sample-web-app-api-mysql’ app

INSERT INTO Member VALUES 
 (100001,'Juan Manuel','Fangio','juan-manuel@fangio.com', false),
 (100002,'Ayrton','Senna','ayrton@senna.com', false),
 (100003,'Michael','Schumacher','michael@schumacher.com', false),
 (100004,'Lewis','Hamilton','lewis@hamilton.com', true);

INSERT INTO Team VALUES 
 (100001,'Ferrari'),
 (100002,'Mercedes'),
 (100003,'McLaren');
 
INSERT INTO TeamMember VALUES 
 (100001,100001,100001,'1956-01-22'),
 (100002,100001,100002,'1954-01-17'),
 (100003,100002,100003,'1988-04-03'),
 (100004,100003,100001,'1996-03-10'),
 (100005,100003,100002,'2010-03-14'),
 (100006,100004,100002,'2007-03-18'),
 (100007,100004,100003,'2013-03-17');
 
INSERT INTO User VALUES
  (100001,'Guest','User','guest@user.com','c2NyeXB0AA8AAAAIAAAAAadRWAxJ7PVQ8T6zW7orsuCiHr38TPYJ9TGVbHEK5hvdbC7lCKxKdebdo0T0wR9Aiye4GQDHbLkcBNVVQZpBDtWGfezCWZvtcw4JZ90HDuhb','guest'),
  (100002,'Admin','User','admin@user.com','c2NyeXB0AA4AAAAIAAAAAfvrpUA5jkh3ObPPUPNQEjbkHXk4vj4xPWH6N8yLEvbgkKqW5zqv3AgsHtTcSL2lzfviyMkXjybHPXeqDY62ZxHEvmTgEY6THddbqOUAOzTQ','admin');
```
‘[原版：https://github.com/chrisveness/koa-sample-web-app-api-mysql)](https://github.com/chrisveness/koa-sample-web-app-api-mysql)’

The full sample app is around 1,000 lines of JavaScript.
