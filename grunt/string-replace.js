module.exports = {
    production: {
        files: {
          './': 'dist/scripts/app.*.js'
        },
        options: {
          replacements: [
              {
                pattern:      'GIRAFFE',
                replacement:  'LIVE'
              }
          ]
        }
      }
}