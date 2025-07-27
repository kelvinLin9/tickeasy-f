# 使用 Node.js 20-alpine 作為基礎映像
FROM node:20-alpine

# 設定工作目錄
WORKDIR /app

# 複製 package.json 與 package-lock.json 至容器
COPY package*.json ./

# 安裝所有依賴
RUN npm ci

# 複製專案所有檔案到容器內
COPY . .

# 暴露端口（使用環境變數或默認 3000）
ENV PORT=3000
EXPOSE $PORT

# 啟動開發伺服器
CMD ["npm", "run", "dev"]