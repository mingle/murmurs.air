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

Stream = {
  "default": function() {
    return {
      description: function() { return "" }
    }
  },
  
  comment: function(xml) {
    var card_number = $("origin number", xml).text()
    return {
      description: function(account) {
        var card_link = Card.link_for(account, card_number, {title: 'from comment of card #' + card_number})
        return "<span class=\"stream\">" + card_link  + "</span>"
      }
    }
  }
}


Stream.parse = function(xml) {
  var type = xml.attr("type")
  return (Stream[type] || Stream['default'])(xml)
}

