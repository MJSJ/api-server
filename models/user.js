module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("user", {
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement: true
    },
    firstname:DataTypes.TEXT,
    lastname:DataTypes.TEXT,
    email:{
        type:DataTypes.CHAR(255),
        allowNull: false,
        unique:true
    },
    active:DataTypes.TEXT
  },{
    timestamps: false
  });

  User.associate = function(models) {
    User.hasMany(models.score);
  }
  User.tableName = "user"
  
  return User;
};