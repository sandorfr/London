# London

A custom, image-centric theme for [Ghost](http://github.com/tryghost/ghost/). Made for publishers and portfolios with plenty of graphics to show off to the world. Completely free and fully responsive, released under the MIT license.

# Getting Started

To develop on the theme we recommend that you use Visual Studio Code with the Remote development tools
* Install [VS Code](https://code.visualstudio.com/)
* Install [Remote Developement Extension Pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)
* Clone this Repository (if not done already)
* Open it
* Hit `Ctrl/Command + Shift + P`, type Reopen
* `Reopen Folder in container` should appear, Select and Press enter
* Wait for the container to be build and start

If it's your first time, start ghost using yarn gulp ghost
* Open a browser on `https://localhost:3001` configure your blog and your account.
* In the admin UI head to `Integrations`
* Click on `Add Custom Integration` at the bottom of the page
* Choose a name, for example `Theme upload`
* Copy the admin API key
* at the root of the repo create a `.token` file and paste the api key inside the file. Save it.
* hit  `Ctrl/Command + C` to terminate the ghost command

To start developping:
* In the VS Code terminal 
* run `yarn gulp` 


**Demo: https://london.ghost.io**

&nbsp;

![london](https://user-images.githubusercontent.com/120485/50552024-84837400-0c82-11e9-8f1d-cf25962c7e62.jpg)


&nbsp;

# First time using a Ghost theme?

Ghost uses a simple templating language called [Handlebars](http://handlebarsjs.com/) for its themes.

We've documented our default theme pretty heavily so that it should be fairly easy to work out what's going on just by reading the code and the comments. Once you feel comfortable with how everything works, we also have full [theme API documentation](https://themes.ghost.org) which explains every possible Handlebars helper and template.

**The main files are:**

- `default.hbs` - The main template file
- `index.hbs` - Used for the home page
- `post.hbs` - Used for individual posts
- `page.hbs` - Used for individual pages
- `tag.hbs` - Used for tag archives
- `author.hbs` - Used for author archives

One neat trick is that you can also create custom one-off templates just by adding the slug of a page to a template file. For example:

- `page-about.hbs` - Custom template for the `/about/` page
- `tag-news.hbs` - Custom template for `/tag/news/` archive
- `author-ali.hbs` - Custom template for `/author/ali/` archive


# Development

London styles are compiled using Gulp/PostCSS to polyfill future CSS spec. You'll need [Node](https://nodejs.org/), [Yarn](https://yarnpkg.com/) and [Gulp](https://gulpjs.com) installed globally. After that, from the theme's root directory:

```bash
$ yarn install
$ yarn dev
```

Now you can edit `/assets/css/` files, which will be compiled to `/assets/built/` automatically.

The `zip` Gulp task packages the theme files into `dist/<theme-name>.zip`, which you can then upload to your site.

```bash
$ yarn zip
```

# PostCSS Features Used

- Autoprefixer - Don't worry about writing browser prefixes of any kind, it's all done automatically with support for the latest 2 major versions of every browser.
- Variables - Simple pure CSS variables
- [Color Function](https://github.com/postcss/postcss-color-function)


# Copyright & License

Copyright (c) 2013-2019 Ghost Foundation - Released under the [MIT license](LICENSE).
