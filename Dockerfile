# Node.jsのバージョンは現在のプロジェクトに合わせてLTS（20系）を選択
FROM node:20-alpine

WORKDIR /app

# 先に依存関係だけコピーしてキャッシュを効かせる
COPY package*.json ./
RUN npm install

# 残りのファイルをコピー
COPY . .

# Metro Bundlerのポートを開放
EXPOSE 8081

# Expoを起動（--go オプションでExpo Go向けに最適化）
CMD ["npx", "expo", "start", "--go"]