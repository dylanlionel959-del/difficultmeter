<div align="center">

# GD Difficulty Meter Creator

[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9C%93-brightgreen.svg)](https://github.com)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-Client-orange.svg)]()

*An open-source client for Geometry Dash creators to overlay dynamic difficulty meters onto level videos.*

</div>

---

## 📖 About

**GD Difficulty Meter Creator** is a lightweight, client-side web tool built for Geometry Dash content creators and private server administrators. It allows you to load a local video of a level, configure difficulty ratings (from Auto to Extreme Demon with star counters), set precise timeline start/end timestamps, and instantly preview the clean, borderless difficulty overlay positioned in any corner of the video.

---

## ✨ Features

* **🎥 Local Video Support:** Select and play any level showcase directly in your browser.
* **⭐ Dynamic Star Counters:** Displays official difficulty faces paired with custom star counts (e.g., `7★`, `10★`).
* **⏱️ Timeline Segments:** Add multiple difficulty changes mapped to exact seconds of your video playback.
* **📐 Custom Positioning:** Place your meter overlay in the Top-Left, Top-Right, Bottom-Left, or Bottom-Right corners.
* **🌐 Multi-language Support:** Built-in language switcher supporting **English** (default) and **Español**.
* **🚀 100% Client-Side / Open Source:** Runs directly in your browser via GitHub Pages with no backend required.

---

## 🛠️ Project Structure

```text
├── index.html          # Main user interface & layout
├── styles.css          # Styling & corner overlay positioning
├── script.js           # Core logic, timeline management, & i18n
├── difficulties.json   # Database of faces, names, and star ratings
└── README.md           # Documentation```text


🚀 Quick Start & Git Commands
To clone this repository and run it locally or deploy it to GitHub Pages, run the following commands in your terminal:

# Clone the repository
```text git clone [https://github.com/YOUR-USERNAME/YOUR-REPOSITORY-NAME.git](https://github.com/YOUR-USERNAME/YOUR-REPOSITORY-NAME.git)```text

# Navigate into the project folder
cd YOUR-REPOSITORY-NAME

# Stage your files
git add .

# Commit your changes
git commit -m "Initial commit: GD Difficulty Meter Creator"

# Push to your GitHub repository
git push origin main


