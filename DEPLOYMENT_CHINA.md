# 中国大陆网络环境部署解决方案

## 问题描述

在中国大陆访问GitHub时经常遇到以下问题：

- HTTP2框架层错误
- 连接超时
- 推送失败
- 网络不稳定

## 解决方案

### 1. 网络配置优化

```bash
# 使用HTTP/1.1协议
git config --global http.version HTTP/1.1

# 增加缓冲区大小
git config --global http.postBuffer 524288000

# 禁用低速限制
git config --global http.lowSpeedLimit 0
git config --global http.lowSpeedTime 999999
```

### 2. 部署脚本选择

#### 选项1：本地部署（推荐）

```bash
./deploy-china.sh --local
```

- 不依赖网络连接
- 生成部署文件到 `.deploy-local` 目录
- 可手动上传到GitHub Pages

#### 选项2：镜像部署

```bash
./deploy-mirror.sh
```

- 使用GitHub镜像进行部署
- 自动重试机制
- 失败时回退到原始地址

#### 选项3：优化后的原始脚本

```bash
./deploy.sh
```

- 增加了重试机制
- 更好的错误处理
- 网络问题时自动跳过同步

### 3. 手动部署步骤

如果所有自动部署都失败，可以手动部署：

1. **准备部署文件**

   ```bash
   ./deploy-china.sh --local
   ```

2. **上传到GitHub Pages**
   - 使用GitHub Desktop
   - 使用Git命令行（网络恢复后）
   - 使用其他Git客户端

3. **验证部署**
   - 访问 https://chenx820.github.io
   - 检查网站是否正常显示

### 4. 网络环境建议

#### 使用代理

```bash
# 设置HTTP代理
git config --global http.proxy http://proxy.example.com:8080
git config --global https.proxy https://proxy.example.com:8080

# 取消代理
git config --global --unset http.proxy
git config --global --unset https.proxy
```

#### 使用VPN

- 连接稳定的VPN服务
- 确保VPN支持Git协议

#### 使用GitHub镜像

- github.com.cnpmjs.org
- hub.fastgit.xyz
- github.com.cnpmjs.org

### 5. 故障排除

#### 常见错误及解决方案

**错误1：HTTP2 framing layer error**

```bash
git config --global http.version HTTP/1.1
```

**错误2：Connection timeout**

```bash
# 使用本地部署
./deploy-china.sh --local
```

**错误3：Push failed**

```bash
# 使用镜像部署
./deploy-mirror.sh
```

**错误4：SSL certificate problem**

```bash
git config --global http.sslVerify false
```

### 6. 性能对比

| 部署方式 | 网络要求 | 成功率 | 速度 | 推荐度     |
| -------- | -------- | ------ | ---- | ---------- |
| 原始脚本 | 高       | 低     | 慢   | ⭐⭐       |
| 镜像部署 | 中       | 中     | 中   | ⭐⭐⭐     |
| 本地部署 | 无       | 高     | 快   | ⭐⭐⭐⭐⭐ |

### 7. 最佳实践

1. **日常开发**：使用本地部署
2. **网络良好时**：使用镜像部署
3. **紧急情况**：手动上传文件
4. **定期检查**：验证网站是否正常

### 8. 自动化建议

可以设置定时任务自动检查部署状态：

```bash
# 添加到crontab
0 */6 * * * cd /path/to/project && ./deploy-china.sh --local
```

## 总结

针对中国大陆网络环境，推荐使用以下策略：

1. **首选**：本地部署 + 手动上传
2. **备选**：镜像部署
3. **最后**：优化后的原始脚本

这样可以确保在各种网络环境下都能成功部署您的网站。
