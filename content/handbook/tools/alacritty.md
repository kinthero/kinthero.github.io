+++
title = "alacritty"
+++

## 配置

### 安装 Catppuccin 主题

```bash
curl -LO --output-dir ~/.config/alacritty https://github.com/catppuccin/alacritty/raw/main/catppuccin-frappe.toml
```

### 配置文件

配置文件在 `~/.config/alacritty/alacritty.toml`。

```toml
[general]
import = [
  "~/.config/alacritty/catppuccin-frappe.toml"
]
live_config_reload = true

[window]
dimensions = { columns = 160, lines = 42 }
padding = { x = 10, y = 10}
opacity = 0.80
decorations = "None"
startup_mode = "Windowed"

[font]
normal = { family = "FiraCode Nerd Font Mono" }
size = 15

[cursor]
style = { blinking = "Always" }
blink_interval = 600
blink_timeout = 0

[mouse]
hide_when_typing = true

[keyboard]
bindings = [
  { key = "Enter", mods = "Alt", action = "ToggleMaximized" },
  { key = "F11", action = "ToggleFullscreen" }
]

[terminal]
shell = { program = "tmux", args = ["new-session", "-A", "-s", "alacritty"] }
```
