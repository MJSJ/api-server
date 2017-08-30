module.exports = function(sequelize, DataTypes) {
    var Subject = sequelize.define("subject", {
      id:{
          type:DataTypes.BIGINT(11),
          primaryKey:true,
          autoIncrement: true
      },
      name:{
          type:DataTypes.STRING(45),
          unique:true
      },

    },{
      timestamps: true,
      updatedAt: false,
      charset:'utf8',
      collate: 'utf8_general_ci'
    });

    Subject.associate = function(models) {
        Subject.belongsTo(models.user, {
          onDelete: "CASCADE",
          foreignKey: {
            allowNull: false
          }
        });
        Subject.hasMany(models.history);
    }
  
    Subject.tableName = "subject"
    
    return Subject;
  };