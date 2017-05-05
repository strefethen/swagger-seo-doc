# swagger-seo-doc

A tool to generate a proto-type, SEO friendly, static documentation site for a swagger.json file. Uses [pug](https://pugjs.org/api/getting-started.html) for templates.

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