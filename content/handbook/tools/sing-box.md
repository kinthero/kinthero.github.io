+++
title = "sing-box 安装与使用"
+++

sing-box 是一个通用的代理客户端，这里记录在 Ubuntu 上以 TUN 模式全局代理的安装与日常使用。

## 安装

使用官方 apt 源安装：

```bash
sudo mkdir -p /etc/apt/keyrings
sudo curl -fsSL https://sing-box.app/gpg.key -o /etc/apt/keyrings/sagernet.asc
sudo chmod a+r /etc/apt/keyrings/sagernet.asc
echo 'Types: deb
URIs: https://deb.sagernet.org/
Suites: *
Components: *
Enabled: yes
Signed-By: /etc/apt/keyrings/sagernet.asc' | sudo tee /etc/apt/sources.list.d/sagernet.sources
sudo apt-get update
sudo apt-get install sing-box
```

验证版本：

```bash
sing-box version
```

## 从订阅生成配置

### 下载订阅

机场会提供一个订阅链接（一般形如 `https://xxx.com/api/v1/client/subscribe?token=...`）。在机场网站的「用户中心 / 我的订阅」里复制它，下载保存：

```bash
curl -L '订阅链接' -o ~/proxy/subscription.yaml
```

> 订阅链接里带 token，等同账号密码，不要写进公开文档或提交到仓库。

订阅文件是 Base64 包裹的节点链接列表。用 `subscription-converter` 转换成 sing-box 配置：

```bash
cd ~/proxy/subscription-converter
./bin/subscription-converter convert \
  -input ~/proxy/subscription.yaml \
  -from base64 \
  -to sing-box \
  -output ~/proxy/config.json
```

转换完先做一次语法检查：

```bash
sing-box check -c ~/proxy/config.json
```

## 配置要点

生成的配置是 TUN 模式全局代理，核心结构：

- `inbounds`：一个 `tun` 入站，`auto_route` + `strict_route` 接管系统路由
- `outbounds`：所有节点 + 一个 `selector`（名字叫 `proxy`），用于在节点间切换
- `route.final`：指向 `proxy`，默认所有流量走代理
- `dns`：本地 DNS 直连，远端 DNS（`1.1.1.1`）走代理，避免 DNS 泄漏

### 关于 insecure

机场节点普遍使用「TLS 伪装」：SNI 填一个正常网站域名（如 `baidu.com`），但服务器实际返回的是自签的伪装证书，证书与 SNI 并不匹配。

因此订阅链接里会有 `allowInsecure=1`，转换后必须体现为节点的：

```json
"tls": {
  "enabled": true,
  "server_name": "baidu.com",
  "insecure": true
}
```

缺少 `"insecure": true` 时，sing-box 会在 TLS 握手阶段报错：

```text
tls: failed to verify certificate: x509: certificate is not valid for any names
```

（`subscription-converter` 已支持解析 `allowInsecure`，正常转换不会缺这个字段。）

### 网页面板（切换节点用）

在配置里加 `experimental.clash_api`，sing-box 会暴露一个 Clash 兼容 API 并自动下载网页仪表盘（zashboard）：

```json
"experimental": {
  "clash_api": {
    "external_controller": "0.0.0.0:9090",
    "external_ui": "/var/lib/sing-box/ui",
    "external_ui_download_url": "https://github.com/Zephyruso/zashboard/releases/latest/download/dist.zip",
    "external_ui_download_detour": "proxy",
    "secret": "kilos",
    "default_mode": "rule"
  }
}
```

- `external_controller` 绑 `0.0.0.0` 表示局域网可访问；只本机用就改 `127.0.0.1`
- `secret` 是打开面板时要填的密码
- `external_ui_download_detour` 指定下载仪表盘走代理，否则可能下不动 GitHub

启动后浏览器打开 `http://<本机IP>:9090/ui/`，填入 secret 即可实时切换节点、看延迟和流量。

## 以服务方式运行

apt 安装自带 `sing-box.service`，它固定读取 `/etc/sing-box/config.json`。把配置装过去并设为开机自启：

```bash
sudo install -m 644 -o sing-box -g sing-box ~/proxy/config.json /etc/sing-box/config.json
sudo systemctl enable --now sing-box
```

## 日常使用

```bash
sudo systemctl status sing-box        # 查看状态
sudo journalctl -u sing-box -f        # 实时日志
sudo systemctl restart sing-box       # 改了配置后重载
sudo systemctl stop sing-box          # 停止代理
sudo systemctl start sing-box         # 启动代理
```

验证是否生效，出口 IP 变成节点所在地即为成功：

```bash
curl https://api.ip.sb/geoip
```

## 切换节点

开启网页面板后，直接在浏览器里切换即可（见上文「网页面板」）。

没有面板时，可以在 `config.json` 里给 `selector`（tag 为 `proxy`）加 `default` 字段：

```json
{
  "outbounds": [ "...节点 tag..." ],
  "tag": "proxy",
  "type": "selector",
  "default": "🇯🇵日本 01 | 高级专线"
}
```

改完重载：

```bash
sudo systemctl restart sing-box
```

## 更新订阅

节点会不定期变动，定期重新转换并重载：

```bash
# 1. 重新下载订阅（订阅链接见上文）
curl -L '订阅链接' -o ~/proxy/subscription.yaml
# 2. 重新转换
cd ~/proxy/subscription-converter
./bin/subscription-converter convert \
  -input ~/proxy/subscription.yaml \
  -from base64 \
  -to sing-box \
  -output ~/proxy/config.json
# 3. 装到系统并重载
sudo install -m 644 -o sing-box -g sing-box ~/proxy/config.json /etc/sing-box/config.json
sudo systemctl restart sing-box
```
