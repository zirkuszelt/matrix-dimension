(function() {

    const { WidgetApi, MatrixCapabilities, EventDirection, WidgetEventCapability } = window.mxwidgets()
    let params = new URLSearchParams(document.location.search);
    const widgetId = params.get('widgetId');
    const me = params.get('matrixId');
    const api = new WidgetApi(widgetId);


    window.widgetObj = {
        inControl: false,
        inControlId: 'nobody',
        curPage: 4,
        showPage(n) {
            if(!window.widgetObj.inControl) return
            window.widgetObj.curPage = n
            sendPage()
        },
        takeControl() {
            // window.widgetObj.inControl = true
            sendPage()
        },
    }

    function handleEvent(data) {
        console.log('got event', data)
        const { sender, content } = data
        window.widgetObj.curPage = parseInt(content.page)
        window.widgetObj.inControlId = sender
        window.widgetObj.inControl = !!(sender == me)
    }
    function sendPage() {
        api.sendStateEvent('presentation', 'presentation', {
            page: window.widgetObj.curPage,
            random: Math.random().toString(16) // to ensure the state event is send to everyone
        })
        setTimeout( () => {
            if(!window.widgetObj.inControl) {
                window.widgetObj.inControlId = 'you might not have the permission'
            }
        }, 1000)
    }

    api.requestCapabilityToSendState('presentation', 'presentation')
    api.requestCapabilityToReceiveState('presentation', 'presentation')
    
    api.on("ready", function() {
        console.log('ready', api)
    });
    api.on('action:send_event', ({detail}) => {
        handleEvent(detail.data)

    });
    api.start();


    setInterval(() => {
        if(!window.widgetObj.inControl) return
        // periodically send the current state
        // sendPage()
    }, 3000)
})()