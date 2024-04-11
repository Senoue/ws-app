# Melody Docker Compose Guide

このガイドでは、Docker コンテナを使用して `melody` アプリケーションを簡単に起動する方法を説明します。

## 必要条件

- Docker がシステムにインストールされていること
- Docker Compose が利用可能であること

## 起動手順

### ステップ 1: リポジトリのクローン

まず、GitHubから `melody` アプリケーションのリポジトリをローカルマシンにクローンします。

```sh
git clone https://github.com/Senoue/ws-app.git
cd ws-app
```

### ステップ 2: コンテナのビルドと起動
以下のコマンドを実行して melody アプリケーションを含む Docker コンテナをビルドし、起動します。

```sh
docker compose up
```

### ステップ 4: melody の使用
コンテナを起動したら、ブラウザで http://localhost:8000 にアクセスしてアプリケーションを使用できます。



