#!/bin/bash

# Configuration
COMPOSE_FILE="docker-compose.prod.yaml"
ENV_FILE=".env"
EXAMPLE_ENV_FILE=".env.example"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Production Deployment...${NC}"

# 1. Network Setup
echo -e "${YELLOW}Checking networks...${NC}"
if [ -z "$(docker network ls -q -f name=public_network)" ]; then
    echo "Creating public_network..."
    docker network create public_network
fi

if [ -z "$(docker network ls -q -f name=database_network)" ]; then
    echo "Creating database_network..."
    docker network create database_network
fi

# 2. Environment Variable Setup
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}File .env not found. Copying from .env.example...${NC}"
    if [ -f "$EXAMPLE_ENV_FILE" ]; then
        cp "$EXAMPLE_ENV_FILE" "$ENV_FILE"
        echo -e "${GREEN}.env created.${NC}"
    else
        echo -e "${RED}Error: .env.example not found!${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}.env file exists.${NC}"
fi

# 3. APP_KEY Check & Generation
# Extract APP_KEY from .env
APP_KEY=$(grep "^APP_KEY=" "$ENV_FILE" | cut -d '=' -f2)

# Check if key is empty OR contains the placeholder
if [ -z "$APP_KEY" ] || [[ "$APP_KEY" == *"GENERATE_YOUR_OWN_KEY_HERE"* ]]; then
    echo -e "${YELLOW}APP_KEY is missing or is placeholder. Generating new key...${NC}"
    
    # Generate random key
    KEY="base64:$(openssl rand -base64 32)"
    # Escape special chars for sed
    ESCAPED_KEY=$(printf '%s\n' "$KEY" | sed -e 's/[\/&]/\\&/g')
    
    if grep -q "^APP_KEY=" "$ENV_FILE"; then
         sed -i "s/^APP_KEY=.*/APP_KEY=$ESCAPED_KEY/" "$ENV_FILE"
    else
         echo "APP_KEY=$KEY" >> "$ENV_FILE"
    fi
    echo -e "${GREEN}Generated APP_KEY: $KEY${NC}"
fi

# 4. Pull & Build
echo -e "${YELLOW}Pulling/Building images...${NC}"
docker compose -f "$COMPOSE_FILE" pull
# If you build locally: docker compose -f "$COMPOSE_FILE" build

# 5. Start Services
echo -e "${YELLOW}Starting services...${NC}"
docker compose -f "$COMPOSE_FILE" up -d --remove-orphans

# 6. Database Migration
echo -e "${YELLOW}Running database migrations...${NC}"
# Wait a few seconds for DB connection to be ready (rudimentary check)
sleep 5
docker compose -f "$COMPOSE_FILE" exec app php artisan migrate --force

# 7. Storage Link
echo -e "${YELLOW}Linking storage...${NC}"
docker compose -f "$COMPOSE_FILE" exec app php artisan storage:link

# 8. Optimization
echo -e "${YELLOW}Optimizing cache...${NC}"
docker compose -f "$COMPOSE_FILE" exec app php artisan optimize

echo -e "${GREEN}Deployment Completed Successfully!${NC}"
