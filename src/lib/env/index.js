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
    // USER 
    user: {
      list: "/user",
      me: "/user/me",
      register: "/user/register",
      login: "/user/login",
      logout: "/user/logout",
      config: "/user/config",
      changeName: "/user/name",
      setForgotEmail: "/user/setForgotEmail",
      
      // Photo
      photo: "/user/image",
      uploadPhoto: "/user/upload/photo/:id",
      deletePhoto: "/user/upload/photo/:id",
      
      // History
      historico: "/user/historico/lastEpisode",
      
      // Watchlist
      watchlist: "/user/watchlist/:serieId",
      
      // Auth
      auth: "/user/auth",
      
      // Like
      like: "/user/like/:id",
      
      // CRUD
      getById: "/user/:id",
      update: "/user/:id",
      disable: "/user/:id",
    },

    // ===== SERIE =====
    serie: {
      list: "/serie",
      top10: "/serie/top10",
      image: "/serie/image/:serieId",
      getById: "/serie/:id",
      episodes: "/serie/:id/episodes",
      getByName: "/serie/name/:name",
      episodeById: "/serie/episodes/:id",
      stream: "/serie/episodes/:id/stream",
      
      // Home - HERO
      hero: "/serie/home/hero",
      
      // Home - NEW SERIES
      newSeries: "/serie/home/newSeries",
      latest: "/serie/home/latest/:limit",
      
      // Home - CATEGORIES
      categories: "/serie/home/categories",
      categorySeries: "/serie/home/series/:category",
      
      // Home - TRENDING
      homeTop10: "/serie/home/top10",
      trending: "/serie/home/trending",
      highRated: "/serie/home/high-rated",
      
      // Home - PERSONALIZED
      historico: "/serie/home/historico/serie",
      recommended: "/serie/home/recommended",
      watchlistHome: "/serie/home/watchlist",
      
      // Home - SPECIAL
      familia: "/serie/home/familia",
      movies: "/serie/home/filmes/populares",
    },

    // ===== SEARCH =====
    search: "/search",

    // ===== COMMENT =====
    comment: "/comment",

    // ===== PLAN =====
    plan: "/plan",

    // ===== ADMIN =====
    admin: {
      episode: "/admin/episode",
      serie: "/admin/serie",
      uploadEpisodeVideo: "/admin/upload/episode-video/:episodeId/:serieId",
      uploadSerieImage: "/admin/upload/serie-image/:serieId",
      uploadEpisodeMetadata: "/admin/upload/episode-metadata/:episodeId",
    },
  },

  images: {
    defaultUser: "/img/default-user.jpg",
    defaultSerie: "/img/default-serie.png",
  },
};