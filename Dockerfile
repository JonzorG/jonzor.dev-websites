FROM php:8.2-apache

# Install dependencies required for zipping folders
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    && docker-php-ext-install zip

# Enable Apache rewrite module for potential routing/security rules
RUN a2enmod rewrite
