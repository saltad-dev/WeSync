# 微信公众号上链 WeSync

WeSync 是一个发布微信公众号的同时把文章上链的浏览器脚本。此脚本需要配合浏览器的脚本管理器插件一起工作。
[![Watch the video](https://user-images.githubusercontent.com/121119893/209360084-5db67c49-5b4e-4638-909d-b6ae66dc7d8c.png)](https://vimeo.com/783948560)

## 安装

1. 浏览器支持

- Chrome
- Firefox

2. 为浏览器安装的脚本管理器插件
- ViolentMonkey
- TamperMonkey

3. 安装[脚本](./dist/index.user.js)

4. 准备一个用于发布文章的私钥，把私钥粘贴在脚本里。

5. 去[水龙头](https://faucet.crossbell.io/)领取发布文章所需的路费。

6. 在发布页面，可以看到插件已经工作了
https://mp.weixin.qq.com/cgi-bin/appmsg?t=media/appmsg_edit_v2&action=edit

## 贡献
### Development

Development 状态下默认与本地的RPC节点通信。

``` sh
$ yarn dev
```

### Building

```sh
$ yarn build
```

### Lint

``` sh
$ yarn lint
```
