#!/bin/bash

# 安装依赖
echo "正在安装依赖..."
pip install -r requirements.txt

# 启动服务
echo "正在启动服务..."
python app.py
