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

    var apiRoot = API_URL;
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
                that.username, that.password, 'BuildTrees');
    };

    function buildTree(response) {
/*        var jsonResponse;
        if (isValidJson(response)){
            jsonResponse = JSON.parse(response);
        }
        else{
            jsonResponse = ExtractQueryString(response);
            alert(response);
        }*/

        var tree_sha = response.sha;
        var postData = {
            "tree" : tree_sha,
            "message": that.defaultMessage,
            "parents": [
                that.sha_latest_commit
            ]
        };

        postApi(that.repoPrefix + '/git/commits', postData, buildCommit,
                that.username, that.password, 'BuildCommit');
    }

    function buildCommit(response) {
/*        var jsonResponse;
        if (isValidJson(response)){
            jsonResponse = JSON.parse(response);
        }
        else{
            alert(response);
        }*/

        var commit_sha = response.sha;
        var postData = {
            "sha": commit_sha
        };
        type = 'json';

        postApi(that.repoPrefix + '/git/refs/heads/' + that.branchName, postData, commitSuccess,
                that.username, that.password, 'Commit!');
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

    postApi = function(route, data, cb, user, pw, msg) {

        alert(msg);
        postApiOriginal(route, data, cb, user, pw);


        alert('Post 2: ' + msg);
        post2(route, data, user, pw, cb);

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
  /*      POST_API_URL = 'http://api.github.com';
        //POST_API_URL = 'http://' + user + ':' + that.base64encode(pw) + '@api.github.com';
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

        var postData = {
                    login: user,
                    token: pw
                };

        postTest(route, postData);
*/

/*        $.ajax({
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

// Original:

    };

    post2 = function(route, data, user, pw, cb){
        var invocation = new XMLHttpRequest();
var url = API_URL + route;
     
  if(invocation)
    {
      invocation.open('POST', url, true);
      invocation.setRequestHeader("Authorization", "Basic " + that.base64encode(user + ':' + pw))
      invocation.setRequestHeader('X-PINGOTHER', 'pingpong');
      invocation.setRequestHeader('Content-Type', 'application/json');
      invocation.onreadystatechange = cb;
      invocation.send(JSON.stringify(data)); 
    }
}
    
    postApiOriginal = function(route, data, cb, user, pw) {
            $.ajax({
                type: 'POST',
                url: API_URL + route,
                data: JSON.stringify(data),
                dataType: 'json',
                contentType: 'application/x-www-form-urlencoded',
                success: cb,
                beforeSend : function(xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + that.base64encode(user + ':' + pw));
                }
            });
    };

    // Send an HTTP POST. Unfortunately, it isn't possible to support a callback
    // with the resulting data. (Please prove me wrong if you can!)
    //
    // This is implemented with a hack to get around the cross-domain
    // restrictions on ajax calls. Basically, a form is created that will POST
    // to the GitHub API URL, stuck inside an iframe so that it won't redirect
    // this page, and then submitted.
    postTest = function (url, vals) {
        var
        form = document.createElement("form"),
        iframe = document.createElement("iframe");

        // Need to insert the iframe now so contentDocument and contentWindow are defined
        document.body.appendChild(iframe);

        var
        doc = iframe.contentDocument !== undefined ?
            iframe.contentDocument :
            iframe.contentWindow.document,
        key, field;
        vals = vals || {};

        form.setAttribute("method", "post");
        form.setAttribute("action", apiRoot + url);
        for (key in vals) {
            if (vals.hasOwnProperty(key)) {
                field = document.createElement("input");
                field.type = "hidden";
                field.value = encodeURIComponent(vals[key]);
                form.appendChild(field);
            }
        }

        iframe.setAttribute("style", "display: none;");
        doc.body.appendChild(form);
        form.submit();
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

    function ExtractQueryString(responseStr) {
        var oResult = {};
        var aQueryString = responseStr.split(',');
        for (var i = 0; i < aQueryString.length; i++) {
            var aTemp = aQueryString[i].split(":");
            if (aTemp[1].length > 0) {
                oResult[aTemp[0]] = unescape(aTemp[1]);
            }
        }
        return oResult;
    }
};
