type TokenGetter = () => Promise<string>;

let tokenGetter: TokenGetter | null = null;

export function setAuthTokenGetter(getter: TokenGetter | null) {
  tokenGetter = getter;
}

export async function getAccessToken(): Promise<string | null> {
  if (!tokenGetter) return null;
  try {
    return await tokenGetter();
  } catch {
    return null;
  }
}
