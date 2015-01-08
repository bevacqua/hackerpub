# hackerpub

> Post news to HackerNews

# Installation

```shell
$ npm install --save hackerpub
```

# Usage

The example shown below will post a link on HackerNews.

```js
var hackerpub = require('hackerpub');

hackerpub({
  username: '{{your HN username}}',
  password: '{{your HN password}}',
  title: 'Example Blog Article',
  url: 'http://exampleblog.com/articles/example-blog-article'
}, done);

function done (err, res, body) {
  // handle response
}
```

# API

# `hackerpub(options, done)`

Posts an article on HN by making a series of requests against their website. Takes some `options`, detailed below.

Property   | Description
-----------|------------------------------------------------------------------------------------
`username` | Your HackerNews username, used to authenticate, and to post the news on your behalf
`password` | Your HackerNews password, used to authenticate
`title`    | A title for the news item
`url`      | The URL to the news item
`text`     | A description of the news item

Note that `url` and `text` are exclusive. If you include both, the `url` will take precedence and the `text` will be ignored.

When the requests against HN are done, the `done` callback will be invoked with three arguments.

- `err` will have an error if one occurred, and `null` otherwise
- `res` will be a response object
- `body` will be the response body

# CLI

The CLI has a simple interface. You'll be asked for your credentials once, and they'll be stored at `~/.hpub`. You can edit that file directly, the CLI expects YAML.

```shell
$ cat ~/.hpub
```

```yaml
username: foo,
password: foo
```

```shell
$ hpub -t "some title" -u http://exampleblog.com -x "some text"
> News posted successfully!
```

# License

MIT
