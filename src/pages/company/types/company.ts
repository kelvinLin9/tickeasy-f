export interface CompanyData {
  organizationId: string;
  userId: string;
  orgName: string;
  createdAt: string;
  updatedAt: string;
}
export interface CreateOrganizeData {
  organizationId: string;
  userId: string;
  orgName: string;
  orgAddress: string;
  orgMail: string;
  orgContact: string;
  orgMobile: string;
  orgPhone: string;
  orgWebsite: string;
  createdAt: string;
  updatedAt: string;
}
export interface CompanyDetailData {
  organizationId: string;
  userId: string;
  orgName: string;
  orgAddress: string;
  orgMail: string;
  orgContact: string;
  orgMobile: string;
  orgPhone: string;
  orgWebsite: string;
  status: string;
  verificationStatus: string;
  createdAt: string;
  updatedAt: string;
}
