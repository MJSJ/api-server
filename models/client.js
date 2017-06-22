module.exports = function(sequelize, DataTypes) {
  var Client = sequelize.define("client", {
    id:{
        type:DataTypes.BIGINT(11),
        primaryKey:true,
        autoIncrement: true
    },
    openid:{
        type:DataTypes.STRING(45),
        unique:true
    },
    unionid:{
        type:DataTypes.STRING(45),
        unique:true
    },
    nickname:DataTypes.STRING(45),
    sex:DataTypes.BOOLEAN,
    headimgurl:DataTypes.STRING(255),
    privilege:DataTypes.STRING(45),
    city:DataTypes.STRING(45),
    country:DataTypes.STRING(45),
    province:DataTypes.STRING(45),
    score:DataTypes.BIGINT(11)
  },{
    timestamps: false
  });

  Client.tableName = "client"
  
  return Client;
};