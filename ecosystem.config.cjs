module.exports = {
  apps: [{
    name: 'maxagile-api',
    script: 'dist/server.cjs',
    cwd: '/var/www/html/ai.maxy.academy/maxagile',
    env: {
      NODE_ENV: 'production',
      PORT: 3027,
      VITE_BASE_PATH: '/maxagile/',
      BASE_PATH: '/maxagile'
    }
  }]
}
