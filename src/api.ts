const helpers = {
  getAccessToken: async () => {
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${SPOTIFY_CLIENT_ID}&client_secret=${SPOTIFY_CLIENT_SECRET}`,
    })

    if (res.status !== 200) {
      throw new Error(`Failed to get access token: ${res.statusText}`)
    }

    const data = (await res.json()) as {
      access_token: string
      token_type: string
      expires_in: number
    }
    return data
  },

  fetch: async (...args: Parameters<typeof fetch>) => {
    const { access_token } = await helpers.getAccessToken()

    return fetch(args[0], {
      ...args[1],
      headers: {
        ...(args[1]?.headers ?? {}),
        Authorization: `Bearer ${access_token}`,
      },
    })
  },
}

export const SpotifyAPI = {
  get: {
    users: (userID: string) => ({
      playlists: async () => {
        const res = await helpers.fetch(
          `https://api.spotify.com/v1/users/${userID}/playlists`,
        )

        if (res.status !== 200) {
          throw new Error(
            `Failed to get current user profile.\n ${JSON.stringify(await res.json())}`,
          )
        }

        const data = await res.json()
        return data
      },
    }),
  },
}

export const USER_ID = '11157520071'

const SPOTIFY_CLIENT_ID = Bun.env['SPOTIFY_CLIENT_ID']!
const SPOTIFY_CLIENT_SECRET = Bun.env['SPOTIFY_CLIENT_SECRET']!
