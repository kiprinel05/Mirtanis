# Build context is the repo ROOT (see docker-compose.yml: context: .) so this
# image can build both the main site and the bundled Foto Bugeac sub-site.

# ---- Build mirtanis (main site, Angular 19) ----
FROM node:20-alpine AS build-mirtanis
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY frontend/ ./
RUN npx ng build --configuration production

# ---- Build foto-bugeac (Site3, Angular 17) — served under /bugeac ----
FROM node:20-alpine AS build-bugeac
WORKDIR /app
COPY Site3/package.json Site3/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY Site3/ ./
RUN npx ng build --configuration production --base-href=/bugeac/

# ---- Runtime ----
FROM nginx:1.27-alpine
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-mirtanis /app/dist/mirtanis/browser /usr/share/nginx/html
COPY --from=build-bugeac /app/dist/foto-bugeac/browser /usr/share/nginx/html/bugeac
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
