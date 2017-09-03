module.exports = function(sequelize, DataTypes) {
    var History = sequelize.define("history", {
      id:{
          type:DataTypes.BIGINT(11),
          primaryKey:true,
          autoIncrement: true
      },
      tag:{
          type:DataTypes.STRING(45)
      },
      content:{
          type:DataTypes.STRING(255)
      },
    },{
        timestamps: true,
        updatedAt: false,
        charset:'utf8',
        collate: 'utf8_general_ci'
    });
    History.associate = function(models) {
        History.belongsTo(models.subject, {
            onDelete: "CASCADE",
            foreignKey: {
              allowNull: false
            }
        });

        History.belongsTo(models.user, {
            foreignKey: {
              allowNull: false
            }
        });
    }

    History.tableName = "history"
    
    return History;
  };