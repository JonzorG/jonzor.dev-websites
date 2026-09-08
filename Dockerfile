FROM php:8.2-apache

# Install dependencies required for zipping folders
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    && docker-php-ext-install zip

# Set PHP Timezone so last-modified dates match local time
RUN echo "date.timezone = Europe/Stockholm" > /usr/local/etc/php/conf.d/timezone.ini

# Enable Apache rewrite module for potential routing/security rules
RUN a2enmod rewrite
