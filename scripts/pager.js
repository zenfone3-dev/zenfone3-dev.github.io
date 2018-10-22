var DEBUG=1

var currentURL=window.location.pathname

function getJsonFromLink(url) {
    url = url.substring(0,url.lastIndexOf('/'));
    return (url.match(/[^.]+(\.[^?#]+)?/) || [])[0] + '/page.json';
}

function getFileFromLink(url) {
    url = url.substring(url.lastIndexOf("/")+ 1);
    return (url.match(/[^.]+(\.[^?#]+)?/) || [])[0];
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
            $.each(data[0].changelog[0].header, function(key, val) {
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
        $.getJSON(getJsonFromLink(currentURL), function(data) {
            window.location = data[0].latestbuild;
        });

}

