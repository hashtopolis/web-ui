
export const DEFAULT_CONFIG = {
  prodApiEndpoint: 'http://localhost:8080/api/v2',
  prodApiPort: '8080',
  frontEndUrl: 'http://localhost:8080',
  prodApiMaxResults: '3000',
  devApiEndpoint: 'http://localhost:3000',
  agentURL: '/api/server.php',
  agentdownloadURL: '/agents.php?download=',
  appName: 'Hashtopolis',
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
    copyright: 's3in!c Hashtopolis: 0.14.0',
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
  // File settings 10 * 1024 *1024 (5.24mb)
  chunkSizeTUS: 5242880,
};


