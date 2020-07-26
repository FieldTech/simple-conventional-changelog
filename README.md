# simple-conventional-changelog

[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/FieldTech/simple-conventional-changelog)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![npm version](https://img.shields.io/npm/v/@fieldtech/simple-conventional-changelog/latest.svg)](https://www.npmjs.org/package/@fieldtech/simple-conventional-changelog)
[![npm downloads](https://img.shields.io/npm/dm/@fieldtech/simple-conventional-changelog.svg)](http://npm-stat.com/charts.html?package=@fieldtech/simple-conventional-changelog&from=2020-04-02)
[![Build Status](https://www.travis-ci.org/FieldTech/simple-conventional-changelog.svg?branch=master)](https://www.travis-ci.org/FieldTech/simple-conventional-changelog)

作为 [X-Developer](https://x-developer.cn) 生产力工具家族成员，Simple Conventional Changelog 简化了 [commitizen](https://github.com/commitizen/cz-cli) 的提交步骤，并提供了中文支持。

基于 [conventional changelog](https://github.com/conventional-changelog/conventional-changelog) 但实现了更简单的注释风格，仅需一行，如下所示：

```
#123 feat 中文交互式支持
```

此适配器生成的 `Git` 注释完整兼容 [X-Developer](https://x-developer.cn) 对 `Git` 仓库的数据分析。

## 安装

`commitizen` 提供了交互式命令行，来生成格式化的 `Git` 注释，运行以下命令进行安装。

```
$ npm install -g commitizen
```

## 配置

### 生成配置

进入您的 `Git仓库` 目录，非 `node.js` 项目，需运行以下命令创建 `package.json` 文件。

```
$ npm init --yes
```

随后运行以下命令即启用 simple-conventional-changelog 风格的提交规范。

```
$ commitizen init @fieldtech/simple-conventional-changelog --save --save-exact
```

检查 `package.json` 可看到下面的生成项。

```json5
{
    "config": {
        "commitizen": {
            "path": "./node_modules/@fieldtech/simple-conventional-changelog"
        }
    }
}
```

### 个性化配置

此为可选项，可以通过更改以下的 `key` 值进行个性化配置。

- maxHeaderWidth：注释行的最大长度
- defaultType：默认的提交类型
- defaultSubject：默认注释
- defaultIssues：默认任务编号


```json5
{
// ...  默认参数值
    "config": {
        "commitizen": {      
            "path": "./node_modules/@fieldtech/simple-conventional-changelog",
            "maxHeaderWidth": 100,
            "defaultType": "",     
            "defaultSubject": "",
            "defaultIssues": ""
        }
    }
// ...    
}
```

## 提交代码

使用 `git cz` 而非 `git commit` 来提交变更。随后您将看到交互式操作界面，根据提示即可完成规范的注释提交。

```
$ git cz
```

## 参考

- [X-Developer](https://x-developer.cn)
