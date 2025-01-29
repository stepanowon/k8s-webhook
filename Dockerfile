# 1 단계
FROM node:22 AS build_stage
WORKDIR /app
COPY . .
RUN npm install

# 2단계
FROM gcr.io/distroless/nodejs22
WORKDIR /app

# 1단계의 /app에서 실행에 필요한 파일만을 복사
COPY --from=build_stage /app/server.js ./server.js
COPY --from=build_stage /app/node_modules ./node_modules
COPY --from=build_stage /app/certs/server.key ./certs/server.key
COPY --from=build_stage /app/certs/server.crt ./certs/server.crt
COPY --from=build_stage /app/certs/ca.crt ./certs/ca.crt

# distroless는 ENTRYPOINT가 node 커맨드가 설정되어 있음
# 그렇기 때문에 ENTRYPOINT ["node", "server.js"] 대신 
# CMD ["server.js"] 를 통해 커맨드를 실행
CMD ["server.js"]
