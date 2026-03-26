# Dockerfile para o backend NestJS - Hema Cereais (Produção)
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# ---- Imagem de produção ----
FROM node:20-alpine AS production

WORKDIR /app

# Copiar package.json e instalar apenas dependências de produção
COPY package*.json ./
RUN npm ci --omit=dev

# Copiar arquivos compilados do builder
COPY --from=builder /app/dist ./dist

# Usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 && \
    chown -R nestjs:nodejs /app

USER nestjs

# Porta padrão do NestJS
EXPOSE 3006

# Comando para iniciar a aplicação
CMD ["node", "dist/main.js"]