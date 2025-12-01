import { SpotifyAPI, USER_ID } from './api'

const res = await SpotifyAPI.get.users(USER_ID).playlists()
console.log(res)
