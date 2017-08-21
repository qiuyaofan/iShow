import Cookies from 'js-cookie';

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus')
    },
    theme: 'default',
    livenewsChannels: Cookies.get('livenewsChannels') || '[]',
    uploadUrl: process.env.BASE_API + '/h5editor/uploadFile',
    audioUploadUrl: process.env.BASE_API + '/h5editor/uploadAudio',
    videoUploadUrl: process.env.BASE_API + '/h5editor/uploadVideo'
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1);
      } else {
        Cookies.set('sidebarStatus', 0);
      }
      state.sidebar.opened = !state.sidebar.opened;
    },
    SET_LIVENEWS_CHANNELS: (status, channels) => {
      status.livenewsChannels = JSON.stringify(channels);
      Cookies.set('livenewsChannels', JSON.stringify(channels));
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    setTheme: ({ commit }, theme) => {
      commit('SET_THEME', theme)
    },
    setlivenewsChannels: ({ commit }, channels) => {
      commit('SET_LIVENEWS_CHANNELS', channels)
    }
  }
};

export default app;
