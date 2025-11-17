# Linera Service Backend - Docker Image for Render.com
FROM rust:1.86.0-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    protobuf-compiler \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Linera CLI
RUN cargo install --locked linera-service@0.15.6

# Create Linera directories
RUN mkdir -p /root/.config/linera
RUN mkdir -p /root/.cache/linera

# Copy wallet configuration
# NOTE: You need to copy your wallet.json here before deploying
COPY wallet.json /root/.config/linera/wallet.json

# Set working directory
WORKDIR /app

# Expose port (Render will set PORT env variable)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

# Start Linera service
CMD linera service --port ${PORT:-8080}
