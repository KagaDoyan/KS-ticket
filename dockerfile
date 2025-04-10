FROM node AS builder

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://bun.sh/install | bash -s "bun-v1.2.5"
COPY . .

ENV PATH="/root/.bun/bin:${PATH}"
RUN bun install --production
ENV NODE_ENV=production
RUN bunx prisma generate
CMD ["bun", "src/server.ts"]
