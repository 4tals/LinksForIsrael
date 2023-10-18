
## 🚀 Getting Started

1. **Prerequisites**
   - [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
   - [Ruby 3](https://www.ruby-lang.org/en/documentation/installation/)

1. **Install Dependencies**
   - Install bundler: `gem install bundler`
   - Install project dependencies: `bundle install`

1. ** Setup GitHub API token **
   - Generate token: https://github.com/settings/tokens (check very `read` permission)
   - Save the token in some secure location (e.g. [BitWarden](https://bitwarden.com/))

1. **Run Locally**

   ```bash
   export JEKYLL_GITHUB_TOKEN=<your GitHub API token from the step above>
   bundle exec jekyll serve
   ```

1. **Run the project locally on a mobile device**
   Make sure your phone is connected to the same network as the server and add the `--host` flag to the command above:
   ```
   bundle exec jekyll serve --host=0.0.0.0
   ```
   On your mobile device, open your server's local IP (you can get it using tools like `ipconfig getifaddr en0`)
