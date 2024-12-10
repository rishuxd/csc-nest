import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AddCmntRequest,
  CmntResponse,
  CmntListResponse,
  DeleteCmntRequest,
  DeleteCmntResponse,
  EditCmntRequest,
  GetCmntsByTaskRequest,
  Cmnt,
} from 'types/cmnt';

const CmntTypeEnum = {
  0: 'MSG',
  1: 'INFO',
};

const ContentTypeEnum = {
  0: 'TEXT',
  1: 'IMAGE',
  2: 'VIDEO',
  3: 'AUDIO',
  4: 'FILE',
};

@Injectable()
export class CmntService {
  constructor(@InjectModel('Cmnt') private readonly cmntModel: Model<Cmnt>) {}

  async addCmnt(request: AddCmntRequest): Promise<CmntResponse> {
    const cmntData = {
      ...request,
      cmntType: CmntTypeEnum[request.cmntType],
      contentType: ContentTypeEnum[request.contentType],
    };

    const createdCmnt = new this.cmntModel(cmntData);
    const savedCmnt = await createdCmnt.save();

    return { cmnt: savedCmnt };
  }

  async deleteCmnt(request: DeleteCmntRequest): Promise<DeleteCmntResponse> {
    const result = await this.cmntModel
      .findByIdAndDelete(request.cmntId)
      .exec();
    const message = result
      ? 'Comment deleted successfully.'
      : 'Comment not found!';
    return { message, success: !!result };
  }

  async editCmnt(request: EditCmntRequest): Promise<CmntResponse> {
    const updatedCmnt = await this.cmntModel
      .findByIdAndUpdate(request.cmntId, request, { new: true })
      .exec();

    if (!updatedCmnt) {
      throw new Error('Comment not found!');
    }

    return { cmnt: updatedCmnt };
  }

  async getCmntsByTask(
    request: GetCmntsByTaskRequest,
  ): Promise<CmntListResponse> {
    const comments = await this.cmntModel
      .find({ taskId: request.taskId })
      .exec();
    return { cmnts: comments };
  }
}
