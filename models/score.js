module.exports = function(sequelize, DataTypes) {
  var Score = sequelize.define("score", {
    num:DataTypes.TEXT
  },{
    timestamps: false
  });
  Score.associate = function(models) {
    Score.belongsTo(models.user, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  }
  Score.tableName = "score";
  return Score;
};
