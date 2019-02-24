var DEBUG=0

var currentURL=window.location.pathname

function getJsonFromLink(url) {
    url = url.substring(0,url.lastIndexOf('/'));
    return (url.match(/[^.]+(\.[^?#]+)?/) || [])[0] + '/page.json';
}

function getFileFromLink(url) {
    url = url.substring(url.lastIndexOf("/")+ 1);
    return (url.match(/[^.]+(\.[^?#]+)?/) || [])[0];
}

function EpochToDate(epoch) {
    if (epoch < 10000000000)
        epoch *= 1000;
    var epoch = epoch + (new Date().getTimezoneOffset() * -1);
    return new Date(epoch).toDateString();
}

if (DEBUG) {
    console.log('Json: '+ getJsonFromLink(currentURL));
    console.log('FileName: '+ getFileFromLink(currentURL));
}

switch (getFileFromLink(currentURL)) {

    case 'changelog.html':
        var ch = [];
        var hd = [];
        $.getJSON(getJsonFromLink(currentURL), function(data) {
            $.each(data[0].header, function(key, val) {
                hd.push( '<h1 class="display-4">' + val.title + '</h1>' );
                hd.push( '<p class="lead">' + val.content + '</p>' );
            });
            $("<div/>", {
                html: hd.join("")
            }).appendTo("#header");

            $.each(data[0].changelog[0].changes, function(key, val) {
                ch.push( "<b><p>[" + val.date + "]</p></b>" );
                $.each(val.log, function(key, val) {
                    ch.push( "<p>- " + val + "</p>" );
                });
            });
            $("<div/>", {
                html: ch.join("")
            }).appendTo("#changelogs");
        });
        break;
    case 'download.html':
        var newbuild = [];
        var oldbuild = [];
        $.getJSON(getJsonFromLink(currentURL), function(data) {
            var author = data[0].basketbuild[0].author;
            var folder = data[0].basketbuild[0].folder;
            $.getJSON('https://cors-anywhere.herokuapp.com/https://basketbuild.com/api4web/devs/' + author + '/' + folder, function(api) {
                var sz = api['files'].length - 1;
                newbuild.push( '<h1 class="display-3">Latest Build</h1>' );
                newbuild.push( '<p class="lead">Filename: '+ api['files'][sz].file +'</p>' );
                newbuild.push( '<p class="lead">Size: '+ api['files'][sz].filesize +'</p>' );
                newbuild.push( '<p class="lead">Updated On: '+ EpochToDate(api['files'][sz].fileTimestamp) +'</p>' );
                newbuild.push( '<a href="https://basketbuild.com/uploads/devs/' + author + '/' + folder + api['files'][sz].file +'" class="btn btn-lg btn-light"><i class="fas fa-download"></i> Download</a>' );
                $('#latestbuild').html(newbuild.join(""));
                
                for(i = (sz - 1); i > 0; i--) {
                    oldbuild.push( '<tr>' );
                    oldbuild.push( '<td scope="row">'+ api['files'][i].file +'</td>' );
                    oldbuild.push( '<td>'+ api['files'][i].filesize +'</td>' );
                    oldbuild.push( '<td>'+ EpochToDate(api['files'][i].fileTimestamp) +'</td>' );
                    oldbuild.push( '<td><a href="https://basketbuild.com/uploads/devs/' + author + '/' + folder + api['files'][i].file +'" class="btn btn-sm btn-primary"><i class="fas fa-download"></i> Download</a></td>' );
                    oldbuild.push( '</tr>' );
                }
                $('#oldbuilds').html(oldbuild.join(""));
            });
        });
        break;
    default:
        var hd = [];
        $.getJSON(getJsonFromLink(currentURL), function(data) {
            $.each(data[0].header, function(key, val) {
                hd.push( '<h1 class="display-4">' + val.title + '</h1>' );
                hd.push( '<p class="lead">' + val.content + '</p>' );
            });
            $("<div/>", {
                html: hd.join("")
            }).appendTo("#header");
        });
        break;
}

