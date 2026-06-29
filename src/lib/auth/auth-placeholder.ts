import type { AuthSession, AuthUser } from "@/lib/auth/auth-types";
import { workspaceId } from "@/lib/vgos-data";

export const mockCurrentUser: AuthUser = {
  id: "user-tom-promise",
  name: "Tom Promise",
  email: "tom.promise@example.com",
  role: "OWNER",
  workspace: {
    id: workspaceId,
    name: "VidMaker Growth OS"
  }
};

export function getCurrentUser(): AuthUser {
  return mockCurrentUser;
}

export function getAuthSession(): AuthSession {
  return {
    user: mockCurrentUser,
    authenticated: true,
    provider: "placeholder"
  };
}
