module.exports = function(api) {
  var validEnv = ['development', 'test', 'production']
  var currentEnv = api.env()
  var isDevelopmentEnv = api.env('development')
  var isProductionEnv = api.env('production')
  var isTestEnv = api.env('test')
  const isHMR = process.env.WEBPACK_DEV_SERVER

  if (!validEnv.includes(currentEnv)) {
    throw new Error(
      'Please specify a valid `NODE_ENV` or ' +
        '`BABEL_ENV` environment variables. Valid values are "development", ' +
        '"test", and "production". Instead, received: ' +
        JSON.stringify(currentEnv) +
        '.'
    )
  }

  return {
    presets: [
      isTestEnv && [
        '@babel/preset-env',
        {
          targets: {
            node: 'current'
          }
        }
      ],
      (isProductionEnv || isDevelopmentEnv) && [
        '@babel/preset-env',
        {
          // ???
          forceAllTransforms: true,


          useBuiltIns: 'entry',
          corejs: 3,
          modules: false,

          bugfixes: true,
          loose: true,

          exclude: ['transform-typeof-symbol']
        }
      ],
      "@babel/preset-react",
    ].filter(Boolean),
    plugins: [
      'babel-plugin-macros',

      // VVVV ?
      '@babel/plugin-syntax-dynamic-import',
      isTestEnv && 'babel-plugin-dynamic-import-node',
      '@babel/plugin-transform-destructuring',
      isDevelopmentEnv && isHMR && 'react-refresh/babel',
      // ^^^^ ?

      [
        '@babel/plugin-proposal-class-properties',
        {
          loose: true
        }
      ],

      // VVVVV ?
      [
        '@babel/plugin-proposal-object-rest-spread',
        {
          useBuiltIns: true
        }
      ],
      // ^^^^ ?
      [
        '@babel/plugin-transform-runtime',
        {
          helpers: false,
          regenerator: true,
          corejs: false
        }
      ],

       // VVVVV ?
      [
        '@babel/plugin-transform-regenerator',
        {
          async: false
        }
      ]
      // ^^^^ ?

    ].filter(Boolean)
  }
}