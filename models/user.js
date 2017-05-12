/**
 * Created by hanifa on 5/4/17.
 */
module.exports = function (sequelize, DataTypes) {
    var Users = sequelize.define('Users',{

        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: { 
            type: DataTypes.STRING,
            allowNull: false,
        }, 
        email: { 
            type: DataTypes.STRING, 
            allowNull: false, 
            validate:{ 
                isEmail:true 
            } 
        },
        }
    );
    return Users;
};

module.exports.getUserByUsername = function(username, callback) {
    console.log("what did you pass me? " + username);
}