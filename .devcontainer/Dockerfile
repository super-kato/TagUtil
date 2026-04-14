FROM mcr.microsoft.com/devcontainers/javascript-node:24-bookworm

# Electron の実行に必要なシステム依存関係をインストール
RUN apt-get update && apt-get install -y \
    libnss3 \
    libnspr4 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libasound2 \
    libgbm1 \
    libxss1 \
    libx11-xcb1 \
    && rm -rf /var/lib/apt/lists/*
