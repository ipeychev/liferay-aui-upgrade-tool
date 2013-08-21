(function() {
    'use strict';

    var fs = require('fs-extra'),
        http = require('http-get'),
        path = require('path'),
        program = require('commander'),
        targz = require('tar.gz'),
        Y = require('yui').use('promise');

        outputDir,
        platformURI = {
            gnu32: 'http://nodejs.org/dist/v{version}/node-v{version}-linux-x86.tar.gz',
            gnu64: 'http://nodejs.org/dist/v{version}/node-v{version}-linux-x64.tar.gz',
            osx32: 'http://nodejs.org/dist/v{version}/node-v{version}-darwin-x86.tar.gz',
            osx64: 'http://nodejs.org/dist/v{version}/node-v{version}-darwin-x64.tar.gz',
            win32: 'http://nodejs.org/dist/v{version}/node.exe',
            win64: 'http://nodejs.org/dist/v{version}/x64/node.exe'
        },
        version;

    program
        .option('-n, --nodejs [nodejs version]', 'The version of NodeJS to wrap [0.10.16] by default', '0.10.16')
        .option('-d, --dist [destination folder]', 'The dist folder in which package should be created [dist] by default', path.resolve(__dirname, '../dist'))
        .option('-p, --platform [build platform]', 'The platform, on which NodeJS should run ["win32", "win64", "osx32", "osx64", "gnu32", "gnu64"]', function(value) {
            value = value.split(',');

            return value.map(
                function(item) {
                    return item.trim();
                }
            );
        }, ['win32', 'win64', 'osx32', 'osx64', 'gnu32', 'gnu64'])
        .version('0.0.1')
        .parse(process.argv);

    // download all dist files for the specified platforms
    
    // create temp directory
    outputDir = path.resolve(program.dist, 'temp');

    fs.removeSync(outputDir);
    fs.mkdirsSync(outputDir);

    function copyNodeJS(value) {
        return new Y.Promise(function(resolve, reject) {
            
        });
    }

    function downloadFile(platform, uri, fileName) {
        return new Y.Promise(function(resolve, reject) {
            http.get(uri, fileName, function(error, result) {
                if (error) {
                    console.log(error);

                    reject(error);
                }
                else {
                    console.log('Downloding: ' + result.file + ' finished!');

                    resolve({
                        file: result.file,
                        platform: platform,
                        uri: uri
                    });
                }
            }
        });
    }

    function extractFile(value) {
        return new Y.Promise(function(resolve, reject) {
            var extractedFileName;

            extractedFileName = path.resolve(value.file + '_extracted');

            fs.removeSync(extractedFileName);
            fs.mkdirsSync(extractedFileName);

            if (value.platform.indexOf('win') !== 0) {
                console.log(extractedFileName);

                tgz = new targz().extract(fileName, extractedFileName, function(error) {
                    if (error) {
                        console.log(error);

                        reject(error);
                    }
                    else {
                        resolve({
                            file: extractedFileName,
                            platform: platform
                        });
                    }
                }
            }
            else {
                resolve({
                    file: value.file,
                    platform: platform
                });
            }
        });
    }

    function prepareWrapDir(value) {
        var promise = new Y.Promise(function(resolve, reject) {
            var dirToWrap,
                dirToWrapBin,
                dirToWrapData;

            dirToWrap = path.resolve(value.fileName + '_wrapped');

            console.log(dirToWrap);

            dirToWrapBin = path.resolve(dirToWrap + '/bin');

            console.log(dirToWrapBin);

            dirToWrapData = path.resolve(dirToWrap + '/data');

            console.log(dirToWrapData);

            resolve({
                file: value.file, // the extracted file name
                wrapDir: dirToWrap,
                bin: dirToWrapBin,
                data: dirToWrapData
            })
        });

        promise.then(function(value) {
            return new Y.Promise(function(resolve, reject) {
                fs.mkdirs(value.bin, function(error) {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(value);
                    }
                });
            });
        });

        promise.then(function(value) {
            return new Y.Promise(function(resolve, reject) {
                fs.mkdirs(value.data, function(error) {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(value);
                    }
                });
            });
        });

        return promise;
    }

    program.platform.forEach(
        function(platform) {
            var fileName,
                uri;

            uri = platformURI[platform];

            if (uri) {
                uri = uri.replace(/\{version\}/g, program.nodejs);

                fileName = path.resolve(outputDir + path.sep + uri.substring(uri.lastIndexOf(path.sep)));

                console.log(uri);

                downloadFile(platform, uri, fileName)
                    .then(extractFile)
                    .then(prepareWrapDir)
                    .then(copyNodeJS)
                    .then(copyScript)
                    .then(copyItself, showError);

                request = http.get(uri, fileName, function(fileName, uri, error, result) {
                    var dirToWrap,
                        dirToWrapBin,
                        dirToWrapData,
                        extractedFileName,
                        tgz;

                    // file has been downloaded, extract it
                    // on Windows, just copy it
                    extractedFileName = path.resolve(fileName + '_extracted');

                    fs.removeSync(extractedFileName);
                    fs.mkdirsSync(extractedFileName);

                    if (platform.indexOf('win') !== 0) {
                        console.log(extractedFileName);

                        tgz = new targz().extract(fileName, extractedFileName, function(error) {
                            debugger;
                            if (error) {
                                console.log(error);
                            }
                            else {
                                console.log('The extraction has ended!');

                                dirToWrap = path.resolve(fileName + '_wrapped');

                                console.log(dirToWrap);

                                dirToWrapBin = path.resolve(dirToWrap + '/bin');

                                console.log(dirToWrapBin);

                                dirToWrapData = path.resolve(dirToWrap + '/data');

                                console.log(dirToWrapData);

                                fs.mkdirsSync(dirToWrapBin);

                                fs.mkdirsSync(dirToWrapData);

                                fs.createFileSync(path.resolve(dirToWrapBin + path.sep + 'run.sh'));

                                fs.copy(extractedFileName, dirToWrap, function(error) {
                                    if (error) {
                                        console.error(error);
                                    }
                                    else {
                                        fs.copy()

                                        console.log('Creating wrapped tar.gz file');

                                        tgz.compress(dirToWrap, path.resolve(program.dist + '/lut' + '_' + platform + '.tar.gz'), function(error) {

                                            if (error) {
                                                console.log(error);
                                            }
                                            else {
                                                console.log('The compression has ended!');
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                    else {
                        console.log('');
                    }
                }.bind(this, fileName, uri));
            }
            else {
                console.log('Unsupported platform: ' + platform);
            }
        }
    );
}());