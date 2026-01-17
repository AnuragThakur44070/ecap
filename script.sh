# Build and Run Docker
# docker-compose up --build -d

# Install Dependencies
docker-compose exec app composer install

# Generate App Key
docker-compose exec app php artisan key:generate

# Run Migrations & Seed Admin User
docker-compose exec app php artisan migrate:fresh --seed

# Link Storage (for images)
docker-compose exec app php artisan storage:link