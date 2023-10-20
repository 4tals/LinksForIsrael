# Before you start
[**Join our WhatsApp group**](https://chat.whatsapp.com/JjD8eijWfDXD10QbM2VyaX) - this is where we discuss everything, from product to development.

# Ways to participate

## GitHub Issues
https://github.com/4tals/LinksForIsrael/issues
   * Browse our website and report bugs, suggest features, and request to add missing initiatives.
   * Review open issues, if you find one you would like to work on, talk to us on the chat!

## Review existing initiatives
 For every existing initiative:
 * Are the links still valid?
 * Are there more links we can add (e.g. facebook, WhatsApp, docs)?
 * Is the name misspelled?
 * Can we improve the description?
 * Can we categorize them better (perhaps add new categories and sub-categories)?

If you find anything to improve, feel free to open a PR on the relevant JSON: https://github.com/4tals/LinksForIsrael/tree/main/_data/links

# Support the development effort
We always appreciate more eyes reviewing our PRs and monitoring our pipelines for warnings and errors!

# 🚀 Setting up the environment

1. **Prerequisites**
   - [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
   - [Ruby 3](https://www.ruby-lang.org/en/documentation/installation/)

1. **Clone/fork the repository**: https://github.com/4tals/LinksForIsrael
   * New to GitHub? Check out https://docs.github.com/en/get-started/quickstart/contributing-to-projects
   * Navigate to the repo's root: `cd LinksForIsrae`

1. **Install Dependencies**
   - Install bundler: `gem install bundler`
   - Install project dependencies: `bundle install`

1. **(OPTIONAL) Setup GitHub API token**

   The following step will get rid of a warning during local development (`"No GitHub API authentication"`).
The idea is to get a GitHub API token and place it in the well-known [JEKYLL_GITHUB_TOKEN](https://jekyll.github.io/github-metadata/authentication/#1-jekyll_github_token) environment variable.
   
   - Generate token: https://github.com/settings/tokens (check every `read` permission)
   - Save the token in some secure location (e.g. [BitWarden](https://bitwarden.com/))
   - export `JEKYLL_GITHUB_TOKEN=<GitHub API token produced above>`

   This is not mandatory, but could potentially prevent issues of fidelity between local development and production deployment (to GitHub pages). For more information see: https://github.com/github/pages-gem/issues/399.

1. **Run Locally**

   ```bash 
   bundle exec jekyll serve
   ```

1. **Running the project locally on a mobile device**
   Make sure your phone is connected to the same network as the server and add the `--host` flag to the command above:
   ```
   bundle exec jekyll serve --host=0.0.0.0
   ```
   On your mobile device, open your server's local IP (you can get it using tools like `ipconfig getifaddr en0`)