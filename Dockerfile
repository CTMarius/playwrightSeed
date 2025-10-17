# Use Playwright official image (includes browsers + node)
FROM mcr.microsoft.com/playwright:latest

# Set working dir
WORKDIR /app

# Copy package files first and install deps (leverages Docker layer caching)
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# Copy app source
COPY . .

# Expose configurable port
ENV PORT=3000
EXPOSE 3000

# Default command for the app image remains starting the app.
# We will make the tests service use an overridden entrypoint so tests can run with CLI args.
CMD ["npm", "start"]
