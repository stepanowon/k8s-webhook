# 1 단계
FROM node:18 AS build_stage
WORKDIR /app
COPY . .
RUN npm install

# 2단계
FROM astefanutti/scratch-node:18
WORKDIR /app

# 1단계의 /app에서 실행에 필요한 파일만을 복사
COPY --from=build_stage /app/server.js ./server.js
COPY --from=build_stage /app/node_modules ./node_modules

ENTRYPOINT ["node", "index.js"]
