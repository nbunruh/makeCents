 /**
 * Created by hanifa on 5/4/17.
 */

module.exports = function (sequelize, DataTypes) {
    var Spendings = sequelize.define('Spendings',{

            groupId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            groceries: {
                type: DataTypes.FLOAT,
            },
            gas: {
                type: DataTypes.FLOAT,
            },

            leisure: {
                type: DataTypes.FLOAT,
            },

            totalSpendings: {
                type: DataTypes.FLOAT,
            }
        }

    );
    return Spendings;
};