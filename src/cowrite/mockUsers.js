// Mock users for Velt collaboration demo
export const MOCK_USERS = [
  {
    userId: "emma",
    organizationId: "cowrite-org-prod",
    name: "Emma Chen",
    email: "emma@cowrite.app",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    color: "#8B5CF6", // Purple
  },
  {
    userId: "liam",
    organizationId: "cowrite-org-prod",
    name: "Liam Martinez",
    email: "liam@cowrite.app",
    photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
    color: "#10B981", // Green
  },
];

// Get default user (Emma)
export const getDefaultUser = () => MOCK_USERS[0];

// Get user by ID
export const getUserById = (userId) => {
  return MOCK_USERS.find((user) => user.userId === userId) || getDefaultUser();
};
