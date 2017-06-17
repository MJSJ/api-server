# api-server (handlebars templating + RESTful API using MySQL, on Node.js)


Then at the Unix command line, or using Git Bash on Windows:
````
$ git clone https://github.com/MJSJ/api-server.git
$ cd api-server
$ npm install
$ mysql>  create database api_server
$ npm run db
$ mysql> insert表
$ npm start
````

先装mysql，跑后面的sql语句

只做了ajax的api接口，通过以下方式调用 
* `http:/localhost:3000/score?userId=100001`
* `http:/localhost:3000/score` post，支持cors

## invoke
  app.js => app-api.js => routes-score.js => userService => userDAO

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
├── config
│   └── config.js            #数据库配置
├── logs
├── models
│   ├── modelerror.js
│   ├── score.js
│   └── user.js
├── service
│   ├── userService.js
│   └── scoreService.js
├── dao
│   ├── userDAO.js
│   └── scoreDAO.js
├─ app.js
├─ initdb.js                 #建表
├─ LICENSE
├─ package.json
└─ README.md
```



## Database schema

```sql

create database `api_server`;
use `api_server`;

create table User (
  UserId  integer unsigned not null auto_increment,
  Firstname text,
  Lastname  text,
  Email     text not null,
  Active    bit(1),
  primary key       (UserId),
  unique  key Email (Email(24))
) engine=InnoDB charset=utf8 auto_increment=100001;

create table Score (
  Id integer unsigned not null auto_increment,
  Num   text not null,
  UserId integer unsigned not null,
  primary key (Id),
  foreign key (UserId) references User(UserId)
) engine=InnoDB charset=utf8 auto_increment=100001;




```

## Test data

```sql
-- Test data for ‘koa-sample-web-app-api-mysql’ app

INSERT INTO User VALUES 
 (100001,'Juan Manuel','Fangio','juan-manuel@fangio.com', false),
 (100002,'Ayrton','Senna','ayrton@senna.com', false),
 (100003,'Michael','Schumacher','michael@schumacher.com', false),
 (100004,'Lewis','Hamilton','lewis@hamilton.com', true);

INSERT INTO Score VALUES 
 (100001,'99',100001),
 (100002,'993',100001),
 (100003,'994',100001);
```
‘[原版：https://github.com/chrisveness/koa-sample-web-app-api-mysql)](https://github.com/chrisveness/koa-sample-web-app-api-mysql)’

The full sample app is around 1,000 lines of JavaScript.
