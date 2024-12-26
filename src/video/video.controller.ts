import {
  Controller,
  Injectable,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ResponseDto } from 'src/types/response.dto';
import { VideoService } from './video.service';

@Injectable()
@Controller('/video')
export class VideoController {
  constructor(private readonly videoservice: VideoService) {}

  @Post('/upload')
  @ApiOperation({
    summary: '영상 업로드',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        video: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    type: ResponseDto<string>,
  })
  @UseInterceptors(FileInterceptor('video'))
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseDto<any>> {
    const videoURL = await this.videoservice.videoUploadToS3(file);
    const data = {
      candidateId: `${file.originalname.split('.')[0]}`, // TODO 이거 나중에 어떻게 바꿀지 고민하기
      videoURL,
    };
    console.log(data);

    const result = await this.videoservice.createVideoData(data);

    return ResponseDto.created('upload_success', { videoPath: result });
  }
}
