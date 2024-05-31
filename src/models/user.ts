'use strict';
const {
  Model
} = require('sequelize');
export default (sequelize: any, DataTypes: any) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    fistName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    address: DataTypes.STRING,
    gender: DataTypes.BOOLEAN,
    phoneNumber: DataTypes.STRING,
    image: DataTypes.STRING,
    roleId: DataTypes.STRING,
    positionId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};