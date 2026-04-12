# TagUtil

<p align="center">
  <img src="resources/icon.png" width="128" height="128" alt="TagUtil Icon">
</p>

<p align="center">
  <strong>Functional FLAC metadata editor</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/github/v/release/super-kato/TagUtil?style=flat-square" alt="Release">
  <img src="https://img.shields.io/github/license/super-kato/TagUtil?style=flat-square" alt="License">
  <img src="https://img.shields.io/github/actions/workflow/status/super-kato/TagUtil/release.yml?style=flat-square" alt="Build Status">
</p>

---

**TagUtil** is a desktop application specialized for editing FLAC file metadata.

## Features

- **Metadata Editing**: Full support for editing cover art, title, artist, album, track number, disc number, and more.
- **Multi-value Support**: Properly handles complex tag structures with multiple artists or genres.
- **Atomic Writing**: Ensures data integrity by using atomic operations to prevent corruption during the writing process.
- **Auto Updates**: Automatically detects and notifies when new versions are released to ensure you always have the latest features and stability.

## Screenshots

<p align="center">
  <img src="assets/screenshots/main-ui.png" width="800" alt="TagUtil Main Interface">
</p>

## Installation

Download the latest version from the [Releases Page](https://github.com/super-kato/TagUtil/releases).

- **macOS**: Download the `.dmg` file and drag it into your Applications folder.

## Developer Guide

### Setup & Development

```bash
$ pnpm install
$ pnpm dev
$ pnpm build
```

### Binary Generation

```bash
# For Windows
$ pnpm build:win
# For macOS
$ pnpm build:mac
```
