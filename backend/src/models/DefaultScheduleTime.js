import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class DefaultScheduleTime extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    default_schedule_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'DefaultScheduleConfiguration',
        key: 'id'
      }
    },
    day_of_week: {
      type: DataTypes.ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'),
      allowNull: false
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'DefaultScheduleTime',
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
        name: "default_schedule_id_idx",
        using: "BTREE",
        fields: [
          { name: "default_schedule_id" },
        ]
      },
    ]
  });
  }
}
