export interface LocalizedString {
  ru: string;
  kz: string;
  en: string;
}

export interface LocalizedStringArray {
  ru: string[];
  kz: string[];
  en: string[];
}

export interface ProjectDto {
  id: string;
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  fullDescription?: LocalizedString | null;
  challenge?: LocalizedString | null;
  solution?: LocalizedString | null;
  features?: LocalizedStringArray | null;
  category: string;
  status: 'done' | 'progress' | 'discovery' | string;
  tags: string[];
  image: string;
  gallery?: string[] | null;
  goals?: LocalizedStringArray | null;
  stack?: string[] | null;
  results?: LocalizedString | null;
  isVisible: boolean;
  timeline?: LocalizedString | null;
}

export interface SiteSettingsDto {
  phone: string;
  email: string;
  address: LocalizedString;
  instagram?: string | null;
  linkedin?: string | null;
  telegram?: string | null;
  whatsapp?: string | null;
}

export interface JobDescriptionBlock {
  role: string;
  tasks: string[];
  requirements: string[];
  plusPoints: string[];
  conditions: string[];
}

export interface JobDescriptionLocalized {
  ru: JobDescriptionBlock;
  kz: JobDescriptionBlock;
  en: JobDescriptionBlock;
}

export interface JobDto {
  id: string;
  slug: string;
  title: LocalizedString;
  shortDescription: LocalizedString;
  requirements: LocalizedString[];
  postedDate: string;
  department: string;
  location: string;
  employmentType: string;
  status: string;
  isVisible: boolean;
  description: JobDescriptionLocalized;
  stack?: string[] | null;
  views: number;
  applicants: number;
  publishedAt?: string | null;
  updatedAt: string;
}

export interface ResumeFileDto {
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface JobApplicationDto {
  id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  links?: string | null;
  message?: string | null;
  resumeFile?: ResumeFileDto | null;
  status: string;
  note?: string | null;
  appliedAt: string;
}

export interface AttachmentInfoDto {
  name: string;
  size: number;
  url: string;
}

export interface ServiceRequestDto {
  id: string;
  name: string;
  email?: string | null;
  company?: string | null;
  phone?: string | null;
  service?: string | null;
  budget?: string | null;
  timeline?: string | null;
  description?: string | null;
  attachments: AttachmentInfoDto[];
  status: string;
  processed: boolean;
  adminNote?: string | null;
  createdAt: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateJobDto {
  slug: string;
  title: LocalizedString;
  shortDescription: LocalizedString;
  requirements: LocalizedString[];
  postedDate: string;
  department: string;
  location: string;
  employmentType: string;
  status: string;
  isVisible: boolean;
  description: JobDescriptionLocalized;
  stack?: string[];
}
