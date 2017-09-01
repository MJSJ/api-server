# api-server (handlebars templating + RESTful API using MySQL, on Node.js)


Then at the Unix command line, or using Git Bash on Windows:
````
$ git clone https://github.com/MJSJ/api-server.git
$ cd api-server
$ npm install
$ mysql>  CREATE DATABASE `api_server` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
$ npm run db
$ mysql> insert表
$ npm start
````

先装mysql，跑后面的sql语句

只做了ajax的api接口，通过以下方式调用 
所有详细接口在前端页面可查看
* `http://localhost:8081/login`
* `http://localhost:8081/score/top`
* `http:/localhost:8081/score`
* `http:/localhost:8081/score/top`
* `http://localhost:8081/latestScore`
* `http:/localhost:8081/score` post，支持cors

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

CREATE DATABASE `api_server` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
use `api_server`;

```

## Test data

```sql
-- Test data for ‘api-server’ app

INSERT INTO User VALUES 
 (100001,'旷宇','yursile@hamilton.com', 2,'ddd'),
 (100002,'Ayrton','ayrton@senna.com', 1,'bbb'),
 (100003,'Michael','michael@schumacher.com', 2,'ccc'),
 (100004,'Lewis','lewis@hamilton.com', 2,'ddd'),
 (100005,'Juan Manuel','juan-manuel@fangio.com', 1,'aaa');
 

INSERT INTO Score VALUES 
 (100001,'99','2017-06-18 11:23:49','2017-06-18 11:23:49',100001),
 (100002,'993','2017-06-18 11:23:49','2017-06-18 11:23:49',100001),
 (100003,'994','2017-06-18 11:23:49','2017-06-18 11:23:49',100001),
 (100004,'1993','2017-06-18 11:23:49','2017-06-18 11:23:49',100002),
 (100005,'193','2017-06-18 11:23:49','2017-06-17 11:23:49',100001);


 INSERT INTO Subject VALUES 
 (100001,'什么专题','2017-06-17 11:23:49',100001),
 (100002,'J8专题','2017-06-19 08:13:12',100001),
 (100003,'Y2专题','2017-06-18 11:23:49',100002);


 INSERT INTO History VALUES 
 (100001,'v1','./static/a.html','2017-06-18 11:23:49',100001,100001),
 (100002,'v22','./static/a2.html','2017-07-18 11:23:59',100001,100002), 
 (100003,'什么版本','./static/bb.html','2017-05-22 11:23:59',100002,100003);
  (100003,'y2专题的版本','./static/yyy.html','2017-08-19 11:23:59',100003,100003);

```
[原版：https://github.com/chrisveness/koa-sample-web-app-api-mysql)](https://github.com/chrisveness/koa-sample-web-app-api-mysql)

The full sample app is around 1,000 lines of JavaScript.
