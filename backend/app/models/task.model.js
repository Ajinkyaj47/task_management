module.exports = (sequelize, Sequelize) => {
  const Task = sequelize.define("task_meta", {
    title: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.ENUM('To Do', 'In progress', 'Done') // Corrected ENUM usage
    },
    due_date: {
      type: Sequelize.DATE, // Corrected TIMESTAMP to DATE
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    }
  }, {
    timestamps: false, // This will disable createdAt and updatedAt fields
    underscored: true // This will use snake_case for column names
  });
  return Task;
};
