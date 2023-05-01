
export const DEFAULT_CONFIG = {
  prodApiEndpoint: 'https://crackz.one/api/v2',
  prodApiPort: '8080',
  frontEndUrl: 'https://crackz.one/',
  prodApiMaxResults: '3000',
  devApiEndpoint: 'http://localhost:3000',
  agentURL: '/api/server.php',
  agentdownloadURL: '/agents.php?download=',
  appName: 'Hashtopolis V1',
  favicon: 'assets/img/favicon.ico',
  header: {
    brand: {
      logo: 'assets/img/logo_alter_1.png',
      logored: 'assets/img/logo_red.png',
      name: '',
      height: '60',
      width: '70',
      heightred: '60',
      widthred: '60',
    },
  },
  footer:{
    copyright: 's3in!c Hashtopolis: 0.14.0 0cabad9 branch h2p',
    footer_link_one: {
      link: 'https://github.com/hashtopolis/server',
      name: 'Github'
    },
    footer_link_two: {
      link: '',
      name: 'About'
    },
    footer_link_three: {
      link: '',
      name: 'Help'
    }
  },
  agents:{
    statusOrderBy: 'asc',
    statusOrderByName: 'agentName',
  },
  tasks:{
    priority: 0,
    maxAgents: 0,
    chunkSize: 0,
  },
  // File settings
  chunkSizeTUS: 5000,
};


