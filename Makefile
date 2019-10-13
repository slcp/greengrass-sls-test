.PHONY: help
.DEFAULT_GOAL: help
default: help
help: ## Output available commands
	@echo "Available commands:"
	@echo ""
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

build: ## Build
	bash ./make-build.sh

dependencies:
	@npm install

deploy-dev:
	serverless deploy --stage dev

deploy-uat:
	serverless deploy --stage uat

deploy-prod:
	serverless deploy --stage prod