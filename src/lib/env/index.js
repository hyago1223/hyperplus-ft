export const envs = {
  appName: "Hyperplus",
  serverApi: process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:3000",

  routes: {
    home: "/home",
    login: "/user/login",
    signup: "/signup",
    admin: "/admin",
    player: "/player",
    settings: "/settings",
    search: "/search",
  },

  api: {
    //User
    login: "/user/login",
    me: "/user/me",
    logout: "/user/logout",
    like: "/user/like",

    series: "/serie",
    top10: "/serie/top10",

    episode: "/episode",
    adminEpisode: "/admin/episode",
    adminSerie: "/admin/serie",
    setEmail: "/user/setForgotEmail",
  },

  images: {
    defaultUser: "/img/default-user.jpg",
    defaultSerie: "/img/default-serie.png",
  },
};