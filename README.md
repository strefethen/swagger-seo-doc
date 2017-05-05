# swagger-seo-doc

A tool to generate a proto-type, SEO friendly, static documentation site for a swagger.json file. Uses [pug](https://pugjs.org/api/getting-started.html) for templates and is based on [Bootstrap](https://getbootstrap.com/).

**Note:**  This is *by no means* complete. I wrote it to illustrate some simple concepts and facilitate further discussion regarding swagger documenation and there are many SEO concepts missing but the file structure is meaningful as a starting point. Additionally, there are lots of pieces of swagger that are not covered here. You've been warned.

Kudos to Atlassian blog post on [building node cli's](https://developer.atlassian.com/blog/2015/11/scripting-with-node/).

    $ git clone https://github.com/strefethen/swagger-seo-doc.git
    $ cd swagger-seo-doc
    $ npm install
    // Install the tool globally so it works as a normal CLI
    $ npm install -g
    // Link it so you can continue developing on it and the changes will be reflected in the global version
    $ npm link
    // Run it...
    $ swagger-seo-doc http://petstore.swagger.io/v2/swagger.json -p ./reference
    $ cd reference
    $ open index.html