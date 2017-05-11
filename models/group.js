/**
 * Created by hanifa on 5/6/17.
 */
module.exports = function (sequelize, DataTypes) {
    var Groups = sequelize.define('Groups',{

            UserId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            groupName: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            groupImage: {
                type: DataTypes.STRING
            },

            groupTheme: {
                type: DataTypes.STRING,
                allowNull: false,
            }
        }
    );
    return Groups;
};