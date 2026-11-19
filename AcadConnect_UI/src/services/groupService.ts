import api from './api';
import { ENDPOINTS } from './endpoints';
import { MainGroup, Subgroup } from '../types';
import { CreateMainGroupFormData, CreateSubgroupFormData } from '../utils/validators';

export interface MyGroupResponse {
  mainGroup: MainGroup;
  subgroup: Subgroup | null;
  allMySubgroups?: Subgroup[];
}

export const groupService = {
  async getMyGroup(): Promise<MyGroupResponse> {
    const res = await api.get<MyGroupResponse>(ENDPOINTS.MY_GROUP);
    return res.data;
  },

  async getAllGroups(): Promise<MainGroup[]> {
    const res = await api.get<MainGroup[]>(ENDPOINTS.GROUPS);
    return res.data;
  },

  async createGroup(data: CreateMainGroupFormData): Promise<MainGroup> {
    const res = await api.post<MainGroup>(ENDPOINTS.GROUPS, data);
    return res.data;
  },

  async getGroupById(id: string): Promise<MainGroup> {
    const res = await api.get<MainGroup>(ENDPOINTS.GROUP_BY_ID(id));
    return res.data;
  },

  async getInvitePreview(inviteCode: string): Promise<MainGroup> {
    const res = await api.get<MainGroup>(ENDPOINTS.INVITE_PREVIEW(inviteCode));
    return res.data;
  },

  async joinByInvite(inviteCode: string): Promise<{ message: string; group: MainGroup }> {
    const res = await api.post<{ message: string; group: MainGroup }>(ENDPOINTS.INVITE_JOIN(inviteCode));
    return res.data;
  },

  async leaveGroup(groupId: string): Promise<{ message: string }> {
    const res = await api.post<{ message: string }>(ENDPOINTS.GROUP_LEAVE(groupId));
    return res.data;
  },

  async getGroupSubgroups(groupId: string): Promise<Subgroup[]> {
    const res = await api.get<Subgroup[]>(ENDPOINTS.GROUP_SUBGROUPS(groupId));
    return res.data;
  },

  async createSubgroup(groupId: string, data: CreateSubgroupFormData): Promise<Subgroup> {
    const res = await api.post<Subgroup>(ENDPOINTS.GROUP_SUBGROUPS(groupId), data);
    return res.data;
  },

  async getSubgroupById(id: string): Promise<Subgroup> {
    const res = await api.get<Subgroup>(ENDPOINTS.SUBGROUP_BY_ID(id));
    return res.data;
  },

  async removeSubgroupMember(subgroupId: string, userId: string): Promise<{ message: string }> {
    const res = await api.delete<{ message: string }>(ENDPOINTS.SUBGROUP_MEMBER_REMOVE(subgroupId, userId));
    return res.data;
  },
};
