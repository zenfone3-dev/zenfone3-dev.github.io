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
        $.getJSON('https://cors.io/?https://basketbuild.com/api4web/devs/makorn645/lineage-16.0', function(data) {
            var sz = data['files'].length - 1;
            newbuild.push( '<h1 class="display-3">Latest Build</h1>' );
            newbuild.push( '<p class="lead">Filename: '+ data['files'][sz].file +'</p>' );
            newbuild.push( '<p class="lead">Size: '+ data['files'][sz].filesize +'</p>' );
            newbuild.push( '<p class="lead">Updated On: '+ EpochToDate(data['files'][sz].fileTimestamp) +'</p>' );
            newbuild.push( '<a href="https://basketbuild.com/uploads/devs/makorn645/lineage-16.0/'+ data['files'][sz].file +'" class="btn btn-lg btn-primary"><i class="fas fa-download"></i> Download</a>' );
            $('#latestbuild').html(newbuild.join(""));
            
            for(i = (sz - 1); i > 0; i--) {
                oldbuild.push( '<tr>' );
                oldbuild.push( '<td scope="row">'+ data['files'][i].file +'</td>' );
                oldbuild.push( '<td>'+ data['files'][i].filesize +'</td>' );
                oldbuild.push( '<td>'+ EpochToDate(data['files'][i].fileTimestamp) +'</td>' );
                oldbuild.push( '<td><a href="https://basketbuild.com/uploads/devs/makorn645/lineage-16.0/'+ data['files'][i].file +'" class="btn btn-sm btn-primary"><i class="fas fa-download"></i> Download</a></td>' );
                oldbuild.push( '</tr>' );
            }
            $('#oldbuilds').html(oldbuild.join(""));
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

