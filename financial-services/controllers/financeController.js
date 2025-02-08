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

export const createUserFinance = async (req, res) => {
  try {
    const { userId, financeDetails } = req.body;

    if (!loggedInUsers.has(userId)) {
      return res.status(403).json({ message: "User is not logged in" });
    }

    const userFinance = await prisma.userFinance.create({
      data: {
        userId: userId,
        financeDetails: financeDetails,
      },
    });
    console.log(`User finance details created for: ${userId}`);
    return res.status(201).json(userFinance);
  } catch (error) {
    console.error('Error creating user finance details:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateUserFinance = async (req, res) => {
  try {
    const { userId, financeDetails } = req.body;

    if (!loggedInUsers.has(userId)) {
      return res.status(403).json({ message: "User is not logged in" });
    }

    const updatedUserFinance = await prisma.userFinance.update({
      where: {
        userId: userId,
      },
      data: {
        financeDetails: financeDetails,
      },
    });
    console.log(`User finance details updated for: ${userId}`);
    return res.status(200).json(updatedUserFinance);
  } catch (error) {
    console.error('Error updating user finance details:', error);
    return res.status(500).json({ message: error.message });
  }
};
