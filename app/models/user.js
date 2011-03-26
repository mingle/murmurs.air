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

User = function(id) {
  var attr_store = new MemAttributesStore()
  return {
    'id': id,
    login: function(v) { return attr('login', v, attr_store) },
    name: function(v) { return attr('__name__', v, attr_store) },
    possible_mention_strings: function() {
      var possible_mention_strings = [this.login()]
      possible_mention_strings = possible_mention_strings.concat(this.name().split(' '))
      return possible_mention_strings
    }
  }
}
User.parse = function(xml) {
  var id = parseInt($("id", xml)[0].textContent)
  var user = new User(id)
  user.name($("name", xml).text())
  user.login($("login", xml).text())
  return user
}

User.parse_collection = function(xml) {
  return $("projects_members projects_member user", xml).map(function() {
    return User.parse(this)
  })
}
