# Stage 1: Dependencies (cached unless package.json changes)
FROM mcr.microsoft.com/playwright:v1.59.1-jammy AS deps
WORKDIR /app
COPY package*.json ./
# Install SSH client and add Bitbucket to known_hosts
# This prevents "Host key verification failed"
RUN apt-get update && apt-get install -y openssh-client && \
    mkdir -p -m 0700 ~/.ssh && \
    ssh-keyscan bitbucket.org >> ~/.ssh/known_hosts

# Use --mount=type=ssh to let npm use the host's SSH agent
RUN --mount=type=ssh npm ci --legacy-peer-deps

# Stage 2: Final image (lightweight)
FROM mcr.microsoft.com/playwright:v1.59.1-jammy
WORKDIR /app

# Install additional tools (Java for Allure, AWS CLI)
RUN apt-get update && apt-get install -y \
    openjdk-17-jre \
    curl \
    unzip \
    --no-install-recommends && \
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install && \
    rm -rf awscliv2.zip aws && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Allure
RUN npm install -g allure-commandline@2.10.0

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./

# Copy application code
COPY . .

# Set Java environment
ENV JAVA_HOME="/usr/lib/jvm/java-17-openjdk-amd64"
ENV PATH="$JAVA_HOME/bin:$PATH"

CMD ["npx", "playwright", "test"]

