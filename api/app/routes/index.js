const packageJson = require('../../package.json');
const { 
    checkSchema, 
    check, 
    validationResult 
} = require('express-validator');

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

  app
    .route('/me')
    .get((_req, res) => {

        return res.status(200).send({
            success: true,
            data: {
                name: 'Chukwuma Nwaugha',
                email: 'c.nwaugha@gmail.com',
                github: 'https://github.com/nwaughachukwuma'
            }
        })
    });
    // .get([isAuthenticated, checkSchema(me.meGet)], meController.getMe)
    // .post([isAuthenticated, checkSchema(me.mePatch)], meController.patchMe);

    app.route('/user-info')
        .post([
            check('name').exists(),
            check('email').exists().isEmail(),
            check('phone').exists().isMobilePhone(),
            check('gender').isString(),
            check('country').exists().trim()
          ], async (req, res) => {

             // Finds the validation errors in this request and wraps them in an object with handy functions
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            return res.status(200).send({
                success: true,
                data: {
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone,
                    gender: req.body.gender,
                    country: req.body.country,
                    github: 'https://github.com/nwaughachukwuma'
                }
            })
          })

};