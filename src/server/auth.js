const userid = require('userid');
const { exec } = require('child_process');

const login = (binary, username, password) => new Promise((resolve, reject) => {
  const cmd = `${binary} ${username} ${password}`;
  exec(cmd, (error, stdout, stderr) => {
    return error ? reject(stderr) : resolve(stdout.trim());
  });
});

module.exports = (core, config) => ({
  login: (req, res) => {
    const {username, password} = req.body;
    const {development} = core.config('skylark');
    const {binary} = core.config('skylark.auth');

    if (development) {
      return Promise.resolve({
        id: 1,
        username,
        groups: ['admin']
      });
    }

    return login(binary, username, password)
      .then(result => {
        if (result === 'passwordCorrect') {
          return {
            id: userid(username),
            username,
            groups: ['admin']
          }
        }

        return Promise.reject('Invalid credentials');
      });

    return Promise.resolve(false);
  },

  logout: (req, res) => {
    return Promise.resolve(true);
  }
});
