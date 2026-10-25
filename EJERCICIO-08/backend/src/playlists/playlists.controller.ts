import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { PlaylistsService } from './playlists.service.js';
import { CreateCancionDto } from './create-cancion.dto.js';

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly service: PlaylistsService) {}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post('canciones')
  addCancion(@Body() dto: CreateCancionDto) {
    return this.service.addCancion(dto);
  }

  @Post(':id/canciones')
  addCancionToPlaylist(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateCancionDto,
  ) {
    return this.service.addCancion({ ...dto, playlistId: id });
  }
}