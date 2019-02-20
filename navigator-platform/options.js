// https://stackoverflow.com/questions/19877924/what-is-the-list-of-possible-values-for-navigator-platform
const standard_values = ["Android","BlackBerry","HP-UX","iPad","iPhone","iPod","Linux armv7l","Linux i686","Mac68K","MacIntel","MacPPC","Opera","SunOS","Win16","Win32","WinCE"]

const populate_dropdown = function() {
  let dropdown = document.getElementById('standard_value')

  for (let i=0; i < standard_values.length; i++){
    let val = standard_values[i]
    let opt = document.createElement('option')
    opt.value = val
    opt.textContent = val
    dropdown.appendChild(opt)
  }
}

const get_dropdown_index_from_value = function(val) {
  let index = standard_values.indexOf(val)
  return (index + 1)
}

const get_new_platform_value = function() {
  let dropdown = document.getElementById('standard_value')
  let textbox  = document.getElementById('custom_value')

  return dropdown.value || textbox.value
}

const restore_options = function() {
  chrome.storage.sync.get(['new_platform'], function(result) {
    let val      = result['new_platform'] || ''
    let index    = get_dropdown_index_from_value(val)
    let dropdown = document.getElementById('standard_value')
    let textbox  = document.getElementById('custom_value')

    dropdown.selectedIndex = index

    if (index === 0) {
      textbox.value = val
      textbox.style.display = 'block'
    }
    else {
      textbox.value = ''
      textbox.style.display = 'none'
    }
  })
}

const save_options = function() {
  var new_platform = get_new_platform_value()
  chrome.storage.sync.set({
    "new_platform": new_platform
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status')
    status.textContent = 'Options saved.'
    // Clear status message after a brief period of time
    setTimeout(function() {
      status.textContent = ''
    }, 750)
  })
}

const add_events = function() {
  let dropdown = document.getElementById('standard_value')
  let textbox  = document.getElementById('custom_value')
  let save     = document.getElementById('save')

  dropdown.addEventListener('change', function(){
    if (dropdown.value) {
      textbox.style.display = 'none'
    }
    else {
      textbox.style.display = 'block'
    }
  })

  save.addEventListener('click', save_options)
}

const onload = function() {
  populate_dropdown()
  restore_options()
  add_events()
}

document.addEventListener('DOMContentLoaded', onload)
