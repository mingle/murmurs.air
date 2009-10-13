Screw.Unit(function() {
  describe("Murmur", function() {
    describe("parsing murmur from xml", function() {
      var murmurs
      before(function() {
        var parser = new DOMParser()
        var doc = parser.parseFromString('<?xml version="1.0" encoding="UTF-8"?> \
        <murmurs type="array"> \
          <murmur> \
            <id type="integer">118</id>\
            <author>\
              <id type="integer">638</id>\
              <name>wpc</name>\
              <login>wpc</login>\
              <email>\
              </email>\
              <light type="boolean">false</light>\
              <icon_path>/user/icon/638/wpc_copy.jpg</icon_path>\
            </author>\
            <body>hello</body>\
            <created_at type="datetime">Sun Sep 27 14:50:34 UTC 2009</created_at>\
            <jabber_user_name nil="true"></jabber_user_name>\
            <is_truncated type="boolean">false</is_truncated>\
          </murmur>\
          <murmur>\
            <id type="integer">119</id>\
            <author nil="true"></author>\
            <body>hello</body>\
            <created_at type="datetime">Wed Sep 30 02:50:04 UTC 2009</created_at>\
            <jabber_user_name>admin</jabber_user_name>\
            <is_truncated type="boolean">false</is_truncated>\
          </murmur>\
          <murmur>\
            <id type="integer">120</id>\
            <author nil="true"></author>\
            <body>where is the dirty star?</body>\
            <created_at type="datetime">Wed Sep 30 02:50:16 UTC 2009</created_at>\
            <jabber_user_name>admin</jabber_user_name>\
            <is_truncated type="boolean">false</is_truncated>\
          </murmur>\
        ', "text/xml")
        murmurs = Murmur.parse_collection(doc)
      })
      
      it("should extract id", function() {
        expect($.pluck(murmurs, 'id')).to(equal, [118, 119, 120])
      })
      
      it("should extract content", function() {
        expect($.invoke(murmurs, 'content')).to(equal, ['hello', 'hello', 'where is the dirty star?'])
      })
      
      it("should extract created at", function() {
        expect($.invoke(murmurs, 'created_at')).to(equal, ['Sun Sep 27 14:50:34 UTC 2009', 'Wed Sep 30 02:50:04 UTC 2009', 'Wed Sep 30 02:50:16 UTC 2009'])
      })
      
      it("should extract author name when it exists", function() {
        var authors = $.invoke(murmurs, 'author')
        expect(authors[0].name).to(equal, 'wpc')
      })
    })
    
    describe("rendered content", function() {
      var m
      var preference
      
      before(function() {
        m = new Murmur(0)
        preference = new Preference()
        preference.reset()
      })
            
      it("should append cr with br", function() {        
        m.content("sss\nxxx")
        expect(m.rendered_content()).to(equal, "sss\n<br/>xxx")
      })
      
      it("should escape html tag", function() {
        m.content("<h1>dddd</h1>")
        expect(m.rendered_content()).to(equal, "&lt;h1&gt;dddd&lt;/h1&gt;")
      })
      
      describe("card number substitution", function(){
        it("should replace #ddd with card link", function() {
          m.content("fix bug #111.")
          preference.host("http://example.com")
          preference.project_id("n1")
          expect(m.rendered_content()).to(equal, 'fix bug <a href="http://example.com/projects/n1/cards/111">#111</a>.')
        })
        
      })
      
    })
  })
})