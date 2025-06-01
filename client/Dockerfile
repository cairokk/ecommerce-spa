# Etapa de build
FROM node:18 AS builder
WORKDIR /app

# Copia somente os arquivos necessários para instalar dependências primeiro
COPY package*.json ./
RUN npm install

# Copia o restante do projeto e executa o build
COPY . .

ARG NEXT_PUBLIC_API_GATEWAY_URL
ENV NEXT_PUBLIC_API_GATEWAY_URL=$NEXT_PUBLIC_API_GATEWAY_URL

RUN npm run build

# Etapa de produção
FROM node:18-alpine AS runner
WORKDIR /app

# Apenas os arquivos necessários para execução
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package.json ./

RUN npm install --omit=dev

EXPOSE 3000
CMD ["npm", "start"]
