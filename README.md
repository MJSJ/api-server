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
所有详细接口在前端页面可查看
* `http://localhost:3000/login`
* `http:/localhost:3000/score`
* `http:/localhost:3000/score/top`
* `http://localhost:3000/latestScore`
* `http:/localhost:3000/score` post，支持cors

## 配合前端页面调用
[ajax-fe：https://github.com/MJSJ/ajax-fe)](https://github.com/MJSJ/ajax-fe)

## invoke
  app.js => app-api.js => routes-score.js => scoreService => scoreDAO

## File structure

```
.
├── app-api
│   ├── routes
│       ├── routes-auth.js   #需要权限的接口，还没做完
│       ├── routes-user.js   #可用于做登录，登录功能还没做
│       └── routes-score.js
│   ├── app-api.js
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
  id  integer unsigned not null auto_increment,
  firstname text,
  lastname  text,
  email     text not null,
  active    bit(1),
  password  text not null,
  primary key       (id),
  unique  key email (email(24))
) engine=InnoDB charset=utf8 auto_increment=100001;

create table Score (
  id integer unsigned not null auto_increment,
  num   integer not null,
  userId integer unsigned not null,
  cretedAt DATETIME NOT NULL,
  updateAt DATETIME NOT NULL,
  primary key (id),
  foreign key (userId) references User(userId)
) engine=InnoDB charset=utf8 auto_increment=100001;




```

## Test data

```sql
-- Test data for ‘api-server’ app

INSERT INTO User VALUES 
 (100001,'Juan Manuel','Fangio','juan-manuel@fangio.com', false,'aaa'),
 (100002,'Ayrton','Senna','ayrton@senna.com', false,'bbb'),
 (100003,'Michael','Schumacher','michael@schumacher.com', false,'ccc'),
 (100004,'Lewis','Hamilton','lewis@hamilton.com', true,'ddd');

INSERT INTO Score VALUES 
 (100001,'99','2017-06-18 11:23:49','2017-06-18 11:23:49',100001),
 (100002,'993','2017-06-18 11:23:49','2017-06-18 11:23:49',100001),
 (100003,'994','2017-06-18 11:23:49','2017-06-18 11:23:49',100001),
 (100004,'1993','2017-06-18 11:23:49','2017-06-18 11:23:49',100002);
 (100005,'193','2017-06-18 11:23:49','2017-06-17 11:23:49',100001);

```
[原版：https://github.com/chrisveness/koa-sample-web-app-api-mysql)](https://github.com/chrisveness/koa-sample-web-app-api-mysql)

The full sample app is around 1,000 lines of JavaScript.
