module.exports = {
    angular: {
        options: {
          archive: './build/stavros-portfolio.zip',
        },
        files: [
          {
            expand: true,
            cwd: './dist',
            src: ['**/*'],
            dest: './build/'
          }
        ]
      }
}