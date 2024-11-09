import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Booking extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id_booking: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    guest_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    guest_email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending','approved','rejected'),
      allowNull: true,
      defaultValue: "pending"
    },
    content: {
      type: DataTypes.STRING(255),
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
          { name: "id_booking" },
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
