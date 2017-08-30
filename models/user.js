module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("user", {
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement: true
    },
    name:DataTypes.TEXT,
    email:{
        type:DataTypes.CHAR(255),
        allowNull: false,
        unique:true
    },
    role:{
      type:DataTypes.INTEGER//1:用户,2:管理员
    },
    password:{
      allowNull: false,
      type:DataTypes.TEXT
    }
  },{
    timestamps: false,
    collate: 'utf8_general_ci',
    charset:'utf8'//在这里设置编码....
  });

  User.associate = function(models) {
    User.hasMany(models.score);
  }
  User.tableName = "user"
  
  return User;
};