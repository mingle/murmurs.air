/*
 * Copyright 2009 ThoughtWorks, Inc.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

MemAttributesStore = function() {
  var o = function() {}
  
  var public = {
    get: function(key) {
      key = key.toLowerCase()
      return o[key] === undefined ? null : o[key]
    },
    
    set: function(key, value) {
      key = key.toLowerCase()
      return o[key] = value
    },
    
    to_xml: function() {
      var cr = air.File.lineEnding
      var prefsXML =   '<?xml version="1.0" encoding="utf-8"?>' + cr + '<attributes>' + cr
      for(var key in o) {
        if(key == "prototype"){
          continue
        }
        prefsXML += '  <'+ key +'>' + public.get(key) + "</" + key + ">" + cr 
      }
      prefsXML += '</attributes>'
      return prefsXML
    }
  }
  
  return public
}

MemAttributesStore.from_xml = function(xml) {
  var ret = new MemAttributesStore()
  $(xml).children().each(function() {
    ret.set(this.tagName, this.innerText)
  })
  return ret
}


XMLFileAttributesStore = function(filename) {
  var mem_store = function() {
    return MemAttributesStore.from_xml($.air.readfile(filename))
  }
  
  var public = {
    get: function(key) {
      return mem_store().get(key)
    },
    
    set: function(key, value) {
      var m = mem_store()

      if(m.get(key) == value) { return }

      var ret = m.set(key, value)
      $.air.writefile(filename, m.to_xml())
      return ret
    },
    
    reset: function() {
      $.air.deletefile(filename)
    }
  }
  
  return public
}

EncryptedAttrStore = function() {
  var public = {
    get: function(key) {
      var data = air.EncryptedLocalStore.getItem(key);
      if(data === null) { 
        return null 
      } else {
        return data.readUTFBytes(data.bytesAvailable)
      }
    },
    
    set: function(key, value) {        
      var data = new air.ByteArray();
      data.writeUTFBytes(value)
      return air.EncryptedLocalStore.setItem(key, data )
    },
    
    reset: function() {
      air.EncryptedLocalStore.reset()
    }
  }
  
  return public
}



function attr(name, value, store) {
  return value === undefined ? store.get(name) : store.set(name, value)
}