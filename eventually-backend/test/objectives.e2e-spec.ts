import { AppModule } from '../src/app.module';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import request from 'supertest';
import { App } from 'supertest/types';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { startPostgres, stopPostgres } from './testcontainers';

interface ObjectiveResponse {
  id: number;
  title: string;
  createdAt: string;
}

describe('Objectives', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let module: TestingModule;

  beforeAll(async () => {
    const container = await startPostgres();
    const containerHost =
      process.platform === 'win32' ? '127.0.0.1' : container.getHost();
    process.env.DATABASE_URL = `postgresql://${container.getUsername()}:${container.getPassword()}@${containerHost}:${container.getPort()}/${container.getDatabase()}`;

    const projectRoot = path.join(__dirname, '..');
    const prismaCli = path.join(
      projectRoot,
      'node_modules',
      'prisma',
      'build',
      'index.js',
    );
    const schemaPath = path.join(projectRoot, 'prisma', 'schema.prisma');
    execSync(`node "${prismaCli}" migrate deploy --schema "${schemaPath}"`, {
      stdio: 'inherit',
      env: process.env,
      cwd: projectRoot,
    });
  }, 60000);

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    prismaService = app.get(PrismaService);
    await prismaService.objective.deleteMany({});
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
    if (module) {
      await module.close();
    }
  });

  afterAll(async () => {
    await stopPostgres();
  }, 30000);

  describe('GET /objectives', () => {
    it('should return all objectives', async () => {
      const createdObjective = await prismaService.objective.create({
        data: { title: 'Objective 1' },
        include: { keyResults: true },
      });

      return request(app.getHttpServer())
        .get('/objectives')
        .expect(200)
        .expect([
          {
            id: createdObjective.id,
            title: 'Objective 1',
            createdAt: createdObjective.createdAt.toISOString(),
            keyResults: [],
          },
        ]);
    });
  });

  describe('POST /objectives', () => {
    it('should create an objective', async () => {
      const response = await request(app.getHttpServer())
        .post('/objectives')
        .send({ title: 'Objective 1' })
        .expect(201);

      const body = response.body as ObjectiveResponse;

      expect(body).toMatchObject({
        title: 'Objective 1',
      });
      expect(body.id).toBeDefined();
      expect(body.createdAt).toBeDefined();
    });
  });

  describe('DELETE /objectives/:id', () => {
    it('should delete an objective by id', async () => {
      const createdObjective = await prismaService.objective.create({
        data: { title: 'Objective 1' },
      });

      return request(app.getHttpServer())
        .delete(`/objectives/${createdObjective.id}`)
        .expect(200);
    });
  });
});
