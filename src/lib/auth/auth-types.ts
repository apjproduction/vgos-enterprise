export type AuthRole = "OWNER" | "ADMIN" | "OPERATOR" | "VIEWER";

export type AuthWorkspace = {
  id: string;
  name: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  workspace: AuthWorkspace;
};

export type AuthSession = {
  user: AuthUser;
  authenticated: boolean;
  provider: "placeholder";
};
