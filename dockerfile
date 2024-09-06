FROM node AS builder

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://bun.sh/install | bash
COPY . .

ENV PATH="/root/.bun/bin:${PATH}"
RUN bun upgrade
RUN bun install --production
ENV NODE_ENV production
RUN bunx prisma generate
# RUN bunx prisma migrate dev --name init
RUN bunx prisma generate
CMD ["bun", "src/server.ts"]
