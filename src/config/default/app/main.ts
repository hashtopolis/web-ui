export const DEFAULT_CONFIG = {
  prodApiEndpoint: 'http://localhost:8080/api/v2',
  prodApiMaxResults: '3000',
  agentURL: '/server.php',
  agentdownloadURL: '/agents.php?download=',
  appName: 'Hashtopolis',
  favicon: 'assets/img/favicon.ico',
  header: {
    brand: {
      logo: 'assets/img/logo.png',
      logored: 'assets/img/logo_red.png',
      name: '',
      height: '60',
      width: '60',
      heightred: '60',
      widthred: '60',
    },
  },
  footer:{
    copyright: 's3in!c Hashtopolis: 0.14.3',
    footer_link_one: {
      link: 'https://github.com/hashtopolis',
      name: 'Github'
    },
    footer_link_two: {
      link: 'https://discord.com/invite/S2NTxbz',
      name: 'Discord'
    },
    footer_link_three: {
      link: 'https://hashtopolis.org/',
      name: 'Hashtopolis'
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
