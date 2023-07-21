# my-port-scanner.rb

💥💥💥 Ruby on Railsで開発したポートスキャナーです！  

![成果物](./docs/img/fruit.gif)  

## 実行方法

```shell
docker build -t my-port-scanner-rb .
docker run -it -p 8000:8000 --rm --name my-port-scanner-rb my-port-scanner-rb
```

## 開発環境の構築方法

```shell
# クライアントサイド
cd ./client
yarn install
yarn dev

# サーバーサイド
cd ./server
gem install bundler && bundle install
rails db:create
rails db:migrate
rails db:seed
rails server --port 8000
```
