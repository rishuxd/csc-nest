import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
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
import { SseService } from '../sse/sse.service';
import { Task } from 'types/task';

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
  constructor(
    @InjectModel('Cmnt') private readonly cmntModel: Model<Cmnt>,
    @InjectModel('Task') private readonly taskModel: Model<Task>,
    private readonly sseService: SseService,
  ) {}

  async addCmnt(request: AddCmntRequest): Promise<CmntResponse> {
    if (!request.taskId || !request.senderId || !request.content) {
      throw new BadRequestException(
        'Task ID, Sender ID, and Content are required.',
      );
    }

    const task = await this.taskModel.findById(request.taskId).exec();
    if (!task) {
      throw new NotFoundException('Task not found.');
    }

    const cmntData = {
      ...request,
      cmntType: CmntTypeEnum[request.cmntType],
      contentType: ContentTypeEnum[request.contentType],
    };

    try {
      const createdCmnt = new this.cmntModel(cmntData);
      const savedCmnt = await createdCmnt.save();

      const participants = [task.assignedTo, task.assignedBy].filter(
        (userId) => userId !== request.senderId,
      );

      this.sseService.broadcastToUsers(participants, savedCmnt);

      return { cmnt: savedCmnt };
    } catch (error) {
      throw new InternalServerErrorException('Failed to add comment: ', error);
    }
  }

  async deleteCmnt(request: DeleteCmntRequest): Promise<DeleteCmntResponse> {
    if (!request.cmntId || !request.senderId) {
      throw new BadRequestException('Comment ID and Sender ID are required.');
    }

    try {
      const cmntToDelete = await this.cmntModel.findById(request.cmntId).exec();
      if (!cmntToDelete) {
        throw new NotFoundException('Comment not found.');
      }

      if (cmntToDelete.senderId !== request.senderId) {
        throw new BadRequestException(
          'You are not authorized to delete this comment.',
        );
      }

      const task = await this.taskModel.findById(cmntToDelete.taskId).exec();
      if (!task) {
        throw new NotFoundException('Task not found.');
      }

      const deleteReq = {
        isDeleted: true,
        content: 'This comment has been deleted.',
        mediaUrl: '',
        taggedUser: [],
      };

      const deletedCmnt = this.cmntModel
        .findByIdAndUpdate(request.cmntId, deleteReq, { new: true })
        .exec();

      const participants = [task.assignedTo, task.assignedBy].filter(
        (userId) => userId !== request.senderId,
      );

      this.sseService.broadcastToUsers(participants, deletedCmnt);

      return { message: 'Comment deleted successfully.', success: true };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete comment: ',
        error,
      );
    }
  }

  async editCmnt(request: EditCmntRequest): Promise<CmntResponse> {
    if (!request.cmntId || !request.senderId || !request.content) {
      throw new BadRequestException(
        'Comment ID, Sender ID, and Content are required.',
      );
    }

    try {
      const updateRequest = {
        isEdited: true,
      };

      if (request.content) {
        updateRequest['content'] = request.content;
      }
      if (request.taggedUser) {
        updateRequest['taggedUser'] = request.taggedUser;
      }

      const updatedCmnt = await this.cmntModel
        .findByIdAndUpdate(request.cmntId, updateRequest, { new: true })
        .exec();

      if (!updatedCmnt) {
        throw new NotFoundException('Comment not found.');
      }

      const task = await this.taskModel.findById(updatedCmnt.taskId).exec();
      if (!task) {
        throw new NotFoundException('Task not found.');
      }

      const participants = [task.assignedTo, task.assignedBy].filter(
        (userId) => userId !== request.senderId,
      );

      this.sseService.broadcastToUsers(participants, updatedCmnt);

      return { cmnt: updatedCmnt };
    } catch (error) {
      throw new InternalServerErrorException('Failed to edit comment: ', error);
    }
  }

  async getCmntsByTask(
    request: GetCmntsByTaskRequest,
  ): Promise<CmntListResponse> {
    if (!request.taskId) {
      throw new BadRequestException('Task ID is required.');
    }

    try {
      const comments = await this.cmntModel
        .find({ taskId: request.taskId })
        .exec();

      if (!comments || comments.length === 0) {
        throw new NotFoundException('No comments found for the given task.');
      }

      return { cmnts: comments };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch comments: ',
        error,
      );
    }
  }
}
