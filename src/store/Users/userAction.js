// Atualiza o estado usuário
export const UserAction = ({ authenticate, user, token }) => ({
  type: "UPDATE_USER",
  payload: {
    authenticate,
    user,
    token
  }
});
