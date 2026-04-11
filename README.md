# Cookspan

Jekyll food blog for GitHub Pages.

## Local preview

Requires Ruby **3.0+** (GitHub’s build image uses a current Ruby).

```bash
bundle install
bundle exec jekyll serve
```

Open [http://localhost:4000](http://localhost:4000).

## Home page cards

Each post can include `listing_summary` and `listing_image` in its front matter (shown on the home page under the title, with a thumbnail). Regenerating from the post body sets the image to the **last** markdown image in the article (or the `image` field if there are no inline images):

```bash
ruby scripts/enrich_listing_meta.rb
```

You can also edit those two fields by hand in any post.

## Publishing

Push to the default branch of `cookspan.github.io`. In the repo’s **Settings → Pages**, set the source to **GitHub Actions** or the classic **Deploy from a branch** flow that builds Jekyll, depending on how your account is configured.
