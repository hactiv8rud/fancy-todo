'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Tokens", "UserId", {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: "Users",
          key: "id"
        }
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Tokens", "UserId", {});
  }
};