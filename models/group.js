/**
 * Created by hanifa on 5/6/17.
 */
module.exports = function (sequelize, DataTypes) {
    var Groups = sequelize.define('Groups',{
            UserId: {
                type: DataTypes.INTEGER,
               //allowNull: false
            },

            monthlyBudget: {
                type: DataTypes.FLOAT,
               // allowNull: false,
            },
            weeklyGas: {
                type: DataTypes.FLOAT,
               // allowNull: false,
            },
            weeklyLeisure: {
                type: DataTypes.FLOAT,
               // allowNull: false,
            },
            weeklyGroceries: {
                type: DataTypes.FLOAT,
               // allowNull: false,
            },
        groupChoice: {
                type: DataTypes.STRING,
               // allowNull: false,
            },
        }
    );
    return Groups;
};