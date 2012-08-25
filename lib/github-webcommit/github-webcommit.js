/*
 * GitHub-WebCommit.js 0.1.0
 * 2012 Donal Farrell <www.donalfarrell.com>
 * MIT license
 *
 * Allows a Javascript client to commit a file to a
 * GitHub repository using their Username/Password credentials.
 *
 * Adapted from code by Mark Swanson/Lanyon at https://github.com/swanson/lanyon
 *
 * Example parameters:
 * - repositoryRoot: donskifarrell/donskifarrell.github.com
 * - branchName: gh-pages
 * - defaultCommitPath: _posts/
 * - defaultCommitMessage: Added a new post!
 *
*/
var Github = function(config) {
    var API_URL = 'https://api.github.com';
    var that = this;
    var type = '';

    that.repo = (typeof config.repositoryRoot === "undefined") ?
        alert("The GitHub repository root needs to be defined in order to commit to it!") :
        config.repositoryRoot;

    that.branchName = (typeof config.branchName === "undefined") ?
        alert("The GitHub repository branch name needs to be defined in order to commit to it! Normally this is just 'master'") :
        config.branchName;

    that.commitPath = (typeof config.defaultCommitPath === "undefined") ?
        '' : config.defaultCommitPath;
        
    that.defaultMessage = (typeof config.defaultCommitMessage === "undefined") ?
        "Commit by GitHub-WebCommit.js" : config.defaultCommitMessage;

    this.base64encode = function(string){
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var result     = '';

        var i = 0;
        do {
            var a = string.charCodeAt(i++);
            var b = string.charCodeAt(i++);
            var c = string.charCodeAt(i++);

            a = a ? a : 0;
            b = b ? b : 0;
            c = c ? c : 0;

            var b1 = ( a >> 2 ) & 0x3F;
            var b2 = ( ( a & 0x3 ) << 4 ) | ( ( b >> 4 ) & 0xF );
            var b3 = ( ( b & 0xF ) << 2 ) | ( ( c >> 6 ) & 0x3 );
            var b4 = c & 0x3F;

            if( ! b ) {
                b3 = b4 = 64;
            } else if( ! c ) {
                b4 = 64;
            }

            result += characters.charAt( b1 ) + characters.charAt( b2 ) +
                characters.charAt( b3 ) + characters.charAt( b4 );

        } while ( i < string.length );

        return result;
    };

    this.setCredentials = function(username, password) {
        that.username = username;
        that.password = password;
    };

    this.commit = function(post) {
        that.post = post;
        that.repoPrefix = '/repos/' + that.repo;
        getApi(that.repoPrefix + '/git/refs/heads/' + that.branchName, null, 'getLatestCommit');
    };

    getLatestCommit = function(response) {
        that.sha_latest_commit = response.data.object.sha;
        getApi(that.repoPrefix + '/git/commits/' + that.sha_latest_commit, null, 'getLatestTree');
    };

    getLatestTree = function(response) {
        var sha_base_tree = response.data.tree.sha;
        var postData = {
            "base_tree": sha_base_tree,
            "tree": [
                {
                    "path": that.commitPath + that.post.filename,
                    "mode": "100644",
                    "type": "blob",
                    "content": that.post.body
                }
            ]
        };

        postApi(that.repoPrefix + '/git/trees', postData, buildTree,
                that.username, that.password);
    };

    function buildTree(response) {
        var jsonResponse;
        if (isValidJson(response)){
            jsonResponse = JSON.parse(response);
        }
        else{
            alert(response);
        }

        var tree_sha = jsonResponse.sha;
        var postData = {
            "tree" : tree_sha,
            "message": that.defaultMessage,
            "parents": [
                that.sha_latest_commit
            ]
        };

        postApi(that.repoPrefix + '/git/commits', postData, buildCommit,
                that.username, that.password);
    }

    function buildCommit(response) {
        var jsonResponse;
        if (isValidJson(response)){
            jsonResponse = JSON.parse(response);
        }
        else{
            alert(response);
        }

        var commit_sha = jsonResponse.sha;
        var postData = {
            "sha": commit_sha
        };
        type = 'json';

        postApi(that.repoPrefix + '/git/refs/heads/' + that.branchName, postData, commitSuccess,
                that.username, that.password);
    }

    function commitSuccess(response) {
        alert(response.url);
    }

    getApi = function(route, data, cb){
        $.ajax({
            url: API_URL + route,
            type: 'GET',
            dataType: 'jsonp',
            crossDomain: true,
            processData: false,
            contentType: 'json',
            data: JSON.stringify(data),
            jsonpCallback: cb
        });
    };

    postApi = function(route, data, cb, user, pw) {
/*        $.post( API_URL + route,
                {
                    param: JSON.stringify(data)
                },
                function(data) {
                     alert(data);
                },
                'jsonp',
                beforeSend : function(xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + that.base64encode(user + ':' + pw));
            }
                );*/
        POST_API_URL = 'http://' + user + ':' + that.base64encode(pw) + '@api.github.com';
        //POST_API_URL = 'https://' + that.base64encode(user + ':' + pw) + '@api.github.com';
        $.ajax({
            url: POST_API_URL + route,
            type: 'POST',
            dataType: 'jsonp',
            data: JSON.stringify(data),
            success: function(data) {
                     alert(JSON.parse(data));
                }
        });

/*                $.ajax({
            url: API_URL + route,
            type: 'GET',
            dataType: 'jsonp',
            crossDomain: true,
            processData: false,
            contentType: 'json',
            data: JSON.stringify(data),
            jsonpCallback: cb
        });*/

/*                    beforeSend : function(xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + that.base64encode(user + ':' + pw));
            },*/
    };



    function easySockets(code)
    {
        var socket = new easyXDM.Socket({
            remote: "http://path.to/provider/", // the path to the provider
            onMessage:function(message, origin) {
                //do something with message
            }
        });
    }

    function isValidJson(code)
    {
        try {
            JSON.parse(code);
        } catch (e) {
            return false;
        }
        return true;
    }
};
