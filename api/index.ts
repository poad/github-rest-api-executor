import cookie from 'cookie';

export const config = {
  maxDuration: 60,
};

interface AccessTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope: string;
  token_type: string;
}

async function redirectWithTokenCookies(origin: string, response: Response) {
  const tokens = await (response.json() as Promise<AccessTokenResponse>);
  const expires = new Date(new Date().getTime() + tokens.expires_in * 1000);
  const refreshTokenExpires = new Date(new Date().getTime() + tokens.refresh_token_expires_in * 1000);

  const cookieAccessToken = cookie.serialize(
    'access-token', tokens.access_token, {
      secure: true,
      httpOnly: false,
      path: '/',
      expires,
    });

  const cookieRefreshToken = cookie.serialize(
    'refresh-token', tokens.refresh_token, {
      secure: true,
      httpOnly: false,
      path: '/',
      expires: refreshTokenExpires,
    },
  );

  return new Response(null, {
    headers: [
      ['Location', `${origin}/`],
      ['Set-Cookie', cookieAccessToken],
      ['Set-Cookie', cookieRefreshToken],
    ],
    status: 303,
  });
}

export async function GET(request: Request) {
  const { GITHUB_APP_CLIENT_ID, GITHUB_APP_CLIENT_SECRET } = process.env;
  const url = new URL(request.url);

  const origin = url.origin;
  const headers = request.headers;
  if (headers.has('Cookie')) {
    const cookies = headers.get('Cookie').split('; ').map((keyValue) => keyValue.split('='));
    if (cookies.some((cookie) => cookie[0] === 'access-token')) {
      return Response.redirect(`${origin}/`);
    }
    const refreshToken = cookies.find((cookie) => cookie[0] === 'refresh-token')?.[1];
    if (refreshToken) {
      const queryString = new URLSearchParams({
        client_id: GITHUB_APP_CLIENT_ID,
        client_secret: GITHUB_APP_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }).toString();
      const response = await fetch(
        `https://github.com/login/oauth/access_token?${queryString}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
        },
      );
      return redirectWithTokenCookies(origin, response);
    }
  }
  const params = url.searchParams;
  const code = params.get('code');
  if (!code) {
    return Response.redirect(`${origin}/`);
  }
  const queryString = new URLSearchParams({
    client_id: GITHUB_APP_CLIENT_ID,
    client_secret: GITHUB_APP_CLIENT_SECRET,
    code,
  }).toString();
  const response = await fetch(
    `https://github.com/login/oauth/access_token?${queryString}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    },
  );

  return redirectWithTokenCookies(origin, response);
}