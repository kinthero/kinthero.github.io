+++
title = "llama.cpp"
+++
# llama.cpp 

## 安装

下载源码

```bash
mkdir -p ~/src
git clone https://github.com/ggml-org/llama.cpp.git ~/src/llama.cpp
cd ~/src/llama.cpp
```

编译

```bash
cmake -B build -DGGML_CUDA=ON
cmake --build build --config Release -j$(nproc)
```

创建软链接

```bash
mkdir -p ~/.local/bin 
ln -sf ~/src/llama.cpp/build/bin/llama ~/.local/bin/llama 
```

> 虽然 llama.app 安装可能更加简单，但是部分模型可能无法运行

## 使用

```bash
llama serve -n 8192 -ngl 99 -c 32768 -np 1 -fa on
```

