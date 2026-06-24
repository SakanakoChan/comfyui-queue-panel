# 🗂️ comfyui-queue-panel

> Bring back the classic **Queue** sidebar tab that ComfyUI's newer frontend removed — now with an image feed, a fullscreen lightbox, live previews, and a bunch of knobs to tweak. 🎛️

A small custom node that re-adds (and optimizes) the original **Queue** sidebar panel that existed before ComfyUI frontend `1.32.10`.

Newer ComfyUI frontends dropped the old **Queue** panel — the one that listed your running / pending / finished tasks and let you browse their images. This extension brings it back **without touching the ComfyUI frontend package or any core files**: it just registers a sidebar tab through the still-supported extension API, so it keeps working across frontend updates and **never** requires downgrading. ✅

## 📸 Screenshots

Tasks grouped by Running / Pending / History (**List**), or a flat newest-first grid of every image (**Feed**):

| 📋 List view | 🖼️ Feed view |
| --- | --- |
| <img src="https://github.com/user-attachments/assets/275e7e39-4691-4c13-ab19-e6b7696c38d3" alt="List view" width="320"> | <img src="https://github.com/user-attachments/assets/712ba441-5f11-42a7-a4e9-5b41add7cc75" alt="Feed view" width="320"> |

**🔍 Big image preview** — click any thumbnail for a fullscreen lightbox with navigation:

<img src="https://github.com/user-attachments/assets/8fe714f5-6b6c-40d9-b7b8-40e8e68fd507" alt="Big image preview" width="820">

## ✨ Features

- 🧷 **Queue sidebar tab** with three sections: **Running**, **Pending**, and **History**.
- 🎮 **Task controls** — cancel a running task, delete/clear pending tasks, delete/clear history, and load any task's workflow back onto the canvas.
- 🔀 **Two views** (toggle in the toolbar, remembered between sessions):
  - 📋 **List** — tasks grouped by Running / Pending / History; each history task shows a thumbnail strip of **all** its images (including intermediate `PreviewImage` outputs).
  - 🖼️ **Feed** — a flat, newest-first grid of every recent image, like a classic image feed.
- 🔍 **Lightbox viewer** — click any thumbnail to open a fullscreen viewer with:
  - previous / next navigation (buttons or `←` / `→`), `Esc` or click-backdrop to close,
  - **Open** (original in a new tab), **Download**, **Load workflow**, and an image counter.
- ⚡ **Live feed** (optional) — capture preview images into the Feed *while a task is still running*, instead of waiting for it to finish.
- 🔄 Auto-refreshes from WebSocket events plus a light poll, with change detection to avoid flicker and an in-session cache so reopening the panel is instant.

## ⚙️ Settings

Click the gear icon in the panel toolbar. Every setting is saved in your browser (`localStorage`) and has a hover tooltip.

| Setting | What it does |
| --- | --- |
| **Tasks** | Number of history tasks to load (`0` = all). Higher = slower fetch. |
| **Feed max** | Max images shown in the Feed (`0` = unlimited). Higher = more memory. |
| **Big image %** | Lightbox image size as a percentage of the screen. |
| **UI scale** | Base font size for the panel's text & buttons. |
| **Thumb size** | Thumbnail size (affects both the Feed grid and the list strips). |
| **Live feed** | Show preview images in the Feed during a run (off by default). |

## 📦 Installation

**Via ComfyUI Manager** → *Install via Git URL*, paste the repo URL, then restart.

**Or manually** — clone into your `ComfyUI/custom_nodes/` directory:

```bash
git clone <repository-url> ComfyUI/custom_nodes/comfyui-queue-panel
```

Then:

1. 🔁 Restart ComfyUI.
2. 🧹 Hard-refresh the browser (`Ctrl`+`F5`).

The **Queue** icon will show up in the left sidebar. 🎉

## ✅ Requirements

- A ComfyUI build whose frontend exposes the sidebar tab extension API (`app.extensionManager.registerSidebarTab`) — present in the current Vue-based frontend (tested on `comfyui-frontend-package` 1.45.x).
- No extra Python dependencies — the Python side only registers the web directory.

## 🚀 Usage

- Open the **Queue** tab from the left sidebar.
- Use the toolbar to switch between **List** / **Feed**, open the gear ⚙️ for settings, or hit **Refresh**.
- Click any image to open the lightbox; browse with the arrows or `←` / `→`.
- Tweak limits, sizes, and the live feed in the gear panel — changes apply immediately.

## 🔧 How it works

The extension registers a custom sidebar tab and renders it with plain DOM. It reads the standard ComfyUI HTTP endpoints (`/queue`, `/history`) and listens to the usual WebSocket events (`status`, `progress`, `executing`, `executed`, …). Task actions reuse the existing endpoints (`/interrupt`, `/queue`, `/history`). Images come from ComfyUI's `/view` endpoint and are lazy-loaded by the browser. Nothing in the ComfyUI frontend package or core is patched.

## 📝 Notes & limitations

- If the panel looks empty right after installing, restart ComfyUI and hard-refresh the browser.
- Thumbnails use the original `/view` images downscaled by the browser, so the *first* load of a brand-new image depends on its file size; later views come from the browser's session cache.
- **Big image %** scales the lightbox image to fill the chosen area, so very small / low-res images may look a bit soft when enlarged.
- **Live feed** is off by default — turn it on to see previews appear mid-run.
- If a future frontend removes the sidebar tab API, the tab simply won't appear (a warning is logged); the extension never modifies frontend files.

---

🧸 Just a personal hobby project — built for fun. Use it however you like, tweak it, break it, have fun. No warranties. 😄
