(function() {
    const { WidgetApi, MatrixCapabilities } = window.mxwidgets()
    let params = new URLSearchParams(document.location.search);
    const widgetId = params.get('widgetId');
    const api = new WidgetApi(widgetId);
    
    // Before doing anything else, request capabilities:
    api.requestCapability(MatrixCapabilities.AlwaysOnScreen);
    api.on("ready", function() {
        console.log('ready')
    });
    api.start()

    const domain = params.get('domain')
    const conferenceId = params.get('conferenceId')
    const displayName = params.get('displayName')
    const avatarUrl = params.get('avatarUrl')
    const userId = params.get('userId')
    let iframe

    document.getElementById('button').onclick = () => {
        const params = {
            displayName: displayName,
            avatarUrl: avatarUrl,
            userId: userId,
            autoJoin: 'true'
        }
        const queryString = Object.keys(params).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
        }).join('&');

        document.getElementById('wrapper').style.display = 'none'
        iframe = document.createElement("iframe")
        iframe.id = 'frame'
        iframe.src = `https://${domain}/${conferenceId}?${queryString}`
        iframe.allowFullscreen = true
        iframe.allow = 'microphone; camera; encrypted-media; autoplay; display-capture;'
        iframe.sandbox = 'allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-presentation'
        document.body.append(iframe)
        api.setAlwaysOnScreen(true)
        .then(function(r) {
            console.log("[Widget] Client responded with: ", r);
        }).catch(function(e) {
            console.log("[Widget] Error", e);
        });
    }
    window.addEventListener('message', (ev) => {
        if(ev.data == 'stopWidget') {
            api.setAlwaysOnScreen(false)
            .then(function(r) {
                console.log("[Widget] Client responded with: ", r);
            }).catch(function(e) {
                console.log("[Widget] Error", e);
            });
            document.getElementById('wrapper').style.display = ''
            if(iframe) document.getElementById('frame').remove()            
        } else if(ev.data == 'toggleFullscreen') {
            window.parent.postMessage('toggleRoomFullscreen', '*')
        }
    })
})()