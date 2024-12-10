import { Controller } from '@nestjs/common';
import { CmntService } from './cmnt.service';
import {
  AddCmntRequest,
  CmntListResponse,
  CmntResponse,
  CmntServiceController,
  CmntServiceControllerMethods,
  DeleteCmntRequest,
  DeleteCmntResponse,
  EditCmntRequest,
  GetCmntsByTaskRequest,
} from 'types/cmnt';

@Controller()
@CmntServiceControllerMethods()
export class CmntController implements CmntServiceController {
  constructor(private readonly cmntService: CmntService) {}

  addCmnt(request: AddCmntRequest): Promise<CmntResponse> {
    return this.cmntService.addCmnt(request);
  }

  deleteCmnt(request: DeleteCmntRequest): Promise<DeleteCmntResponse> {
    return this.cmntService.deleteCmnt(request);
  }

  editCmnt(request: EditCmntRequest): Promise<CmntResponse> {
    return this.cmntService.editCmnt(request);
  }

  getCmntsByTask(request: GetCmntsByTaskRequest): Promise<CmntListResponse> {
    return this.cmntService.getCmntsByTask(request);
  }
}
