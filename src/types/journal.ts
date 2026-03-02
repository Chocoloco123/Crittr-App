/**
 * Shared types for journal entries and attachments.
 * Use these across journal page, JournalEditor, JournalList, JournalEntryDetails,
 * and dashboard so the shape stays accurate and backend/mock formats are supported.
 */

export type JournalEntryType =
  | 'general'
  | 'feeding'
  | 'medication'
  | 'exercise'
  | 'vet_visit'
  | 'grooming'
  | 'weight'
  | 'symptoms'

/**
 * Attachment shape used in the app.
 * Supports both:
 * - Mock/frontend: id, type, url, name, size
 * - Backend API: id (number), filename, original_filename, file_path, file_type, file_size, mime_type, created_at
 * Use attachment.name ?? attachment.original_filename and attachment.size ?? attachment.file_size when displaying.
 */
export interface Attachment {
  id: string | number
  type: 'image' | 'video' | 'document'
  url: string
  /** Mock/frontend; backend may send original_filename instead */
  name?: string
  /** Mock/frontend; backend may send file_size instead */
  size?: number
  /** Backend API fields (optional when using mock data) */
  original_filename?: string
  file_path?: string
  file_type?: 'image' | 'video' | 'document'
  file_size?: number
  filename?: string
  mime_type?: string
  created_at?: string
}

export interface JournalEntry {
  id: string
  title: string
  content: string
  petId: string
  petName: string
  entryType: JournalEntryType
  attachments: Attachment[]
  createdAt: string
  updatedAt: string
}
