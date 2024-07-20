import prisma from '../prismaClient.js';

const loggedInUsers = new Set();

export const handleUserRegister = async (userData) => {
  try {
    await prisma.userFinance.create({
      data: {
        userId: userData.id,
        financeDetails: {},
      },
    });
    console.log(`User finance details created for: ${userData.email}`);
  } catch (error) {
    console.error('Error creating user finance details:', error);
  }
};

export const handleUserLogin = async (userData) => {
  try {
    loggedInUsers.add(userData.id);
    console.log(`User logged in: ${userData.email}`);
  } catch (error) {
    console.error('Error handling user login:', error);
  }
};

export const handleUserLogout = async (userData) => {
  try {
    loggedInUsers.delete(userData.id);
    console.log(`User logged out: ${userData.email}`);
  } catch (error) {
    console.error('Error handling user logout:', error);
  }
};

export const createUserFinance = async (userId, financeData) => {
  try {
    if (!loggedInUsers.has(userId)) {
      throw new Error("User is not logged in");
    }

    const userFinance = await prisma.userFinance.create({
      data: {
        userId: userId,
        financeDetails: financeData,
      },
    });
    console.log(`User finance details created for: ${userId}`);
    return userFinance;
  } catch (error) {
    console.error('Error creating user finance details:', error);
    throw error;
  }
};
