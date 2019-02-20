var payload = function(){
  // https://groups.google.com/a/chromium.org/forum/#!topic/chromium-discuss/8cCllrVX4kI

  const old_platform = navigator.platform

  Object.defineProperty(
    navigator,
    'platform',
    {
      get: function (){return (typeof window.crx_navigator_platform === 'string') ? window.crx_navigator_platform : old_platform},
      set: function (a){}
    }
  )
}

var get_hash_code = function(str){
  var hash, i, char
  hash = 0
  if (str.length == 0) {
    return hash
  }
  for (i = 0; i < str.length; i++) {
    char = str.charCodeAt(i)
    hash = ((hash<<5)-hash)+char
    hash = hash & hash  // Convert to 32bit integer
  }
  return Math.abs(hash)
}

var inject_function = function(_function){
  var inline, script, head

  inline = _function.toString()
  inline = '(' + inline + ')()' + '; //# sourceURL=crx_extension.' + get_hash_code(inline)
  inline = document.createTextNode(inline)

  script = document.createElement('script')
  script.appendChild(inline)

  head = document.head
  head.appendChild(script)
}

var inject_options = function(){
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(['new_platform'], (result) => {
      var _function = `function(){window.crx_navigator_platform = ${(typeof result['new_platform'] === 'string') ? JSON.stringify(result['new_platform']) : undefined}}`
      inject_function(_function)
      resolve()
    })
  })
}

var inject_options_then_function = function(_function){
  inject_options()
  .then(() => {
    inject_function(_function)
  })
  .catch(() => {})
}

if (document.readyState === 'complete'){
  inject_options_then_function(payload)
}
else {
  document.addEventListener("DOMContentLoaded", function(event) {
    inject_options_then_function(payload)
  })
}
