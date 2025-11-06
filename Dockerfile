# Etapa 1: Construcción
FROM node:20-slim AS builder

# Instalar dependencias del sistema necesarias
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar los archivos de dependencias primero
COPY package*.json ./

# Instalar dependencias limpias
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Compilar el proyecto Next.js
RUN npm run build

# Etapa 2: Ejecución (imagen ligera)
FROM node:20-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copiar solo lo necesario desde el builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 3000

CMD ["npm", "start"]
