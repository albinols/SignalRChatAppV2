export const loginUser = async (userName, password) => {
  const response = await fetch("https://localhost:7128/api/Auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userName, password }),
  });
  return response;
};

export const signUpUser = async (email, userName, password) => {
  const response = await fetch("https://localhost:7128/api/Auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, userName, password }),
  });
  return response;
};