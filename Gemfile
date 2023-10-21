source "https://rubygems.org"

# Current latest version: https://pages.github.com/versions/
# See https://github.com/actions/jekyll-build-pages/issues/104
gem 'github-pages', '= 228', group: :jekyll_plugins

install_if -> { ENV["GITHUB_ACTIONS"] != "true" } do
    puts "Is GitHub action: #{ENV["GITHUB_ACTIONS"] == "true"}"
    gem "webrick", "~> 1.8"

    install_if Gem.win_platform? do
        puts "Is Windows platform: #{Gem.win_platform?}"
        gem "wdm", "~> 0.1.0"
    end
end 
