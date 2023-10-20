source "https://rubygems.org"

gem "github-pages", group: :jekyll_plugins

install_if -> { ENV["JEKYLL_ENV"] != "production" } do
    puts "non-prod environment detected - installing webrick HTTP server for local debugging"
    gem "webrick", "~> 1.8"

    install_if Gem.win_platform? do
        puts "Windows plaform detected - installing Windows Directory Monitor (Performance-booster)"
        gem "wdm", "~> 0.1.0"
    end
end 