import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class PublicLink extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    link: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "link"
    }
  }, {
    sequelize,
    tableName: 'PublicLink',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "link",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "link" },
        ]
      },
      {
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
