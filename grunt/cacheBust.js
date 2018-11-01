module.exports = {
    pre: {
        options: {
          baseDir: 'dist/',
          assets: [
            'styles/**/*.css',
            'views/**/*.html',
            'scripts/**/*.js'
          ],
          deleteOriginals: true,
          algorithm: 'sha1',
          length: 6,
          prefix: ''
        },
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['views/**/*.html', 'style/*.css', 'scripts/**/*.js','index.html']
        }]
      },
  final: {
    options: {
          baseDir: 'dist/',
          assets: [
            'scripts/app.min.js'
          ],
          deleteOriginals: true,
          algorithm: 'sha1',
          length: 6,
          prefix: ''
        },
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['index.html']
        }]
      }
    }