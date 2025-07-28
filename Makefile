# Flask GraphQL MongoDB App Makefile

# Variables
PYTHON = python3
VENV = venv
FLASK_APP = app.py
PIP = $(VENV)/bin/pip
PYTHON_VENV = $(VENV)/bin/python

# Colors for output
GREEN = \033[0;32m
YELLOW = \033[1;33m
RED = \033[0;31m
NC = \033[0m # No Color

.PHONY: help setup install run dev clean test requirements freeze

# Default target
help:
	@echo "$(GREEN)Flask GraphQL MongoDB App$(NC)"
	@echo ""
	@echo "Available commands:"
	@echo "  $(YELLOW)setup$(NC)          - Create virtual environment and install dependencies"
	@echo "  $(YELLOW)install$(NC)        - Install/update dependencies in existing venv"
	@echo "  $(YELLOW)run$(NC)            - Run the Flask app"
	@echo "  $(YELLOW)dev$(NC)            - Run the Flask app in development mode"
	@echo "  $(YELLOW)requirements$(NC)   - Generate requirements.txt from current env"
	@echo "  $(YELLOW)freeze$(NC)         - Show installed packages"
	@echo "  $(YELLOW)clean$(NC)          - Remove virtual environment and cache files"
	@echo "  $(YELLOW)test$(NC)           - Run tests (when implemented)"

# Setup virtual environment and install dependencies
setup: $(VENV)/bin/activate
	@echo "$(GREEN)Installing dependencies...$(NC)"
	$(PIP) install --upgrade pip
	$(PIP) install -r requirements.txt
	@echo "$(GREEN)Setup complete! Run 'make run' to start the app$(NC)"

# Create virtual environment
$(VENV)/bin/activate:
	@echo "$(GREEN)Creating virtual environment...$(NC)"
	$(PYTHON) -m venv $(VENV)

# Install/update dependencies
install: $(VENV)/bin/activate
	@echo "$(GREEN)Installing/updating dependencies...$(NC)"
	$(PIP) install --upgrade pip
	$(PIP) install -r requirements.txt

# Run the Flask app
run: $(VENV)/bin/activate
	@echo "$(GREEN)Starting Flask GraphQL app...$(NC)"
	@echo "$(YELLOW)GraphQL Playground: http://localhost:5000/graphql$(NC)"
	@echo "$(YELLOW)Web Interface: http://localhost:5000$(NC)"
	$(PYTHON_VENV) $(FLASK_APP)

# Run in development mode with auto-reload
dev: $(VENV)/bin/activate
	@echo "$(GREEN)Starting Flask app in development mode...$(NC)"
	@echo "$(YELLOW)GraphQL Playground: http://localhost:5000/graphql$(NC)"
	@echo "$(YELLOW)Web Interface: http://localhost:5000$(NC)"
	FLASK_ENV=development FLASK_DEBUG=1 $(PYTHON_VENV) $(FLASK_APP)

# Generate requirements.txt from current environment
requirements: $(VENV)/bin/activate
	@echo "$(GREEN)Generating requirements.txt...$(NC)"
	$(PIP) freeze > requirements.txt
	@echo "$(GREEN)requirements.txt updated$(NC)"

# Show installed packages
freeze: $(VENV)/bin/activate
	@echo "$(GREEN)Installed packages:$(NC)"
	$(PIP) list

# Clean up
clean:
	@echo "$(YELLOW)Cleaning up...$(NC)"
	rm -rf $(VENV)
	find . -type d -name "__pycache__" -delete
	find . -type f -name "*.pyc" -delete
	@echo "$(GREEN)Cleanup complete$(NC)"

# Test target (placeholder for future tests)
test: $(VENV)/bin/activate
	@echo "$(YELLOW)Tests not implemented yet$(NC)"
	# $(PYTHON_VENV) -m pytest tests/ -v

# Quick start - setup and run
quickstart: setup run 