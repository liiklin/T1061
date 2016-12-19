# Usage

## In Development

```
  npm run dev
```

## In Publishment

```
  npm run start
```

# .env

`.env`文件默认上传到仓库上，上线前先修改`.env-example`的名字为`.env`。

# PUB/SUB

## Groups

 - 创建组：`groups create`
 - 更新组：`groups update`
 - 删除组：`groups delete`

## Answer

 - 强制同步：`answers sync`

## Questions

 - 创建问题：`questions create`
 - 删除问题：`questions delete`
 - 更新问题：`questions update`
 - 关联标准答案：`questions link`
 - 取消关联标准答案：`questions unlink`
 - 提交简要回复：`questions reply`
 - 提交拒绝回答：`questions abort`

# 提醒

  - 强制更新时报错`error: sorry, too many clients already`？
    需要修改数据库的`clients`连接数，值改为 100 以上。

  - 数据库请自行导入
