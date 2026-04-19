# Cookspan Jekyll Site - Build & Development

.PHONY: help install-hooks serve build clean

help:
	@echo "Available commands:"
	@echo "  make install-hooks  - Install git pre-commit hook for SW cache audit"
	@echo "  make serve          - Start Jekyll development server"
	@echo "  make build          - Build the site for production"
	@echo "  make clean          - Clean build artifacts"

# Install git hooks for service worker cache auditing
install-hooks:
	@echo "🔧 Installing pre-commit hook..."
	@cp .github/hooks/pre-commit .git/hooks/pre-commit
	@chmod +x .git/hooks/pre-commit
	@echo "✅ Pre-commit hook installed successfully!"
	@echo "   The hook will automatically audit and update the service worker cache."

# Start Jekyll development server
serve:
	bundle exec jekyll serve --livereload

# Build site for production
build:
	JEKYLL_ENV=production bundle exec jekyll build

# Clean build artifacts
clean:
	bundle exec jekyll clean
	@rm -rf _site/
