# Use an official Nginx runtime as a parent image
FROM nginx:latest

# Set the working directory to /usr/share/nginx/html
WORKDIR /usr/share/nginx/html

# Copy the current directory contents into the container at /usr/share/nginx/html
COPY . .

# Expose port 80
EXPOSE 80

# Command to run on container start
CMD ["nginx", "-g", "daemon off;"]
