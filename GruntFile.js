module.exports = function(grunt) {
	var gtx = require('gruntfile-gtx').wrap(grunt);

    gtx.loadAuto();

    var gruntConfig = require('./grunt');
    gruntConfig.package = require('./package.json');

    var target = grunt.option('target');
    if (!target) {
        target = "DEV";
    }

    gtx.config(gruntConfig);

    if (target == "LIVE") {
        gtx.alias('build:angular', ['recess:less', 
                                    'clean:angular', 
                                    'copy:libs', 
                                    'copy:distlibs',
                                    'copy:angular', 
                                    'recess:angular', 
                                    'concat:angular',
                                    'string-replace:production', 
                                    'cacheBust:pre',
                                    'uglify:angular',
                                    'cacheBust:final',
                                    'compress:angular']);
    } else {
        gtx.alias('build:angular', ['recess:less', 
                                    'clean:angular', 
                                    'copy:libs', 
                                    'copy:distlibs',
                                    'copy:angular', 
                                    'recess:angular', 
                                    'concat:angular',
                                    'cacheBust:pre',
                                    'uglify:angular',
                                    'cacheBust:final',
                                    'compress:angular']);
   }
    // We need our bower components in order to develop
    gtx.alias('build:html', ['clean:html', 'copy:html', 'recess:html', 'swig:html', 'concat:html', 'uglify:html']);
    gtx.alias('build:landing', ['copy:landing', 'swig:landing']);

    gtx.alias('release', ['bower-install-simple', 'bump-commit']);
    gtx.alias('release-patch', ['bump-only:patch', 'release']);
    gtx.alias('release-minor', ['bump-only:minor', 'release']);
    gtx.alias('release-major', ['bump-only:major', 'release']);
    gtx.alias('prerelease', ['bump-only:prerelease', 'release']);

    gtx.finalise();
}
