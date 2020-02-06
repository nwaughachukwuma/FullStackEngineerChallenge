const packageJson = require('../../package.json');

module.exports = app => {
  app.route('/').get((_req, res) => {
    return res.status(200).send({
      success: true,
      message: 'OK',
      data: {
        serverStatus: 'online',
        version: packageJson.version
      }
    });
  });
};