import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put } from '@nestjs/common';
import { RepositoryService } from '../repository/repository.service';
import { Startup } from './startup';
import { filter, map } from 'rxjs/operators';

@Controller('startup')
export class StartupController {
  PATH = 'startup';

  constructor(private repository: RepositoryService) {
  }

  @Get()
  getAll() {
    return this.repository.getAll(this.PATH);
  }

  @Get(':uuid')
  getByuuid(@Param() params) {
    return this.repository.getByUuid(this.PATH, params.uuid);
  }

  @Post()
  @HttpCode(201)
  create(@Body() startup: Startup) {
    return this.repository.create(this.PATH, startup).pipe(
      filter((result) => !!result),
      map((uuidGenerated) => {
          return {
            uuid: uuidGenerated,
          };
        },
      ),
    );
  }

  @Patch(':uuid')
  @HttpCode(204)
  update(@Param() params, @Body() startup: Startup) {
    return this.repository.update(this.PATH, params.uuid, startup);
  }

  @Put(':uuid')
  @HttpCode(204)
  updateAll(@Param() params, @Body() startup: Startup) {
    return this.repository.updateAll(this.PATH, params.uuid, startup);
  }

  @Delete(':uuid')
  @HttpCode(204)
  delete(@Param() params) {
    return this.repository.delete(this.PATH, params.uuid);
  }
}
