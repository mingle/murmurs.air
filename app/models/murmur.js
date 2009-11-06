Murmur = function(id) {
  var attr_store = new MemAttributesStore()
  
  var mentions_user = function(index, user) {
    var tag_reg_exp = new RegExp('@' + user + '\\b', 'i')
    return (public.content().match(tag_reg_exp) != null)
  }
  
  var public = {
    'id': id,
    content: function(v) { return attr('content', v, attr_store) },
    created_at: function(v) { return attr('created_at', v, attr_store) },
    author: function(v) { return attr('author', v, attr_store) },
    jabber_user_name: function(v){ return attr('jabber_user_name', v, attr_store) },
    
    mentions_current_user: function() {
      return $.any(User.current().possible_mention_strings(), mentions_user)
    },
    
    blank: function() {
      return this.content() == null || this.content().blank()
    },
    
    remurmur:function() {
      var to = this.author() ? this.author().login : this.jabber_user_name()
      return 'RM @' + to + ': ' + this.content() + ' // '
    }
  }
  
  return public
}

Murmur.parse = function(xml) {
  var id = parseInt($("id", xml)[0].textContent)
  var murmur = new Murmur(id)
  murmur.content($("body", xml).text())
  murmur.created_at($("created_at", xml).text())

  murmur.author({
   name: $("author name", xml).text(),
   icon_path: new Preference().host() + $("author icon_path", xml).text(),
   login: $("author login", xml).text()
  })
  return murmur
}

Murmur.parse_collection = function(xml) {
  return $("murmurs murmur", xml).map(function() {
    return Murmur.parse(this)
  })
}

Murmur.id_asc_order = function(left, right) {
  if(left.id == right.id) { return 0 }
  return left.id > right.id ? 1 : -1
}

Murmur.id_desc_order = function(left, right) {
  if(left.id == right.id) { return 0 }
  return left.id < right.id ? 1 : -1
}