FROM denoland/deno:latest
WORKDIR /app

RUN apt update && \
    apt upgrade -y && \
    apt install -y curl wget

COPY . .
RUN deno install && \
    deno run build:prisma && \
    deno task build

EXPOSE 3000
CMD ["deno", "-A", "./.output/server/index.mjs"]
