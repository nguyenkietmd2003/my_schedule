import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Booking extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    free_time_config_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'FreeTimeConfiguration',
        key: 'id'
      }
    },
    guest_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    guest_email: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending','approved','rejected'),
      allowNull: true,
      defaultValue: "pending"
    },
    content: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    name_company: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Booking',
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
        name: "free_time_config_id",
        using: "BTREE",
        fields: [
          { name: "free_time_config_id" },
        ]
      },
    ]
  });
  }
}
