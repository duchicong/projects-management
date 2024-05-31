'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface: any) {
  return queryInterface.bulkInsert('Users', [
    {
      email: 'admin@gmail.com',
      password: 'admin123',
      fistName: 'Du',
      lastName: 'Cong',
      address: 'Ha noi',
      gender: 1,
      phoneNumber: '0904123456',
      image: '',
      roleId: 'R1',
      positionId: 'R1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}
export async function down(queryInterface: any) {
  return queryInterface.bulkDelete('Users', null, {});
}
