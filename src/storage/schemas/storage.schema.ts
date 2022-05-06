import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type StorageDocument = Storage & Document

@Schema({
  timestamps: true,
})
export class Storage {
  @Prop({ required: true })
    originalName: string

  @Prop()
    baseName?: string

  @Prop()
    extName?: string

  @Prop()
    mimeType?: string

  @Prop()
    encoding?: string

  @Prop()
    size?: number

  @Prop()
    MD5Hash?: string

  @Prop({ default: 'root' })
    parentId?: string

  @Prop({ required: true })
    type: string

  @Prop()
    userId?: string

  @Prop()
    createdAt: Date

  @Prop()
    updatedAt: Date
}

export const StorageSchema = SchemaFactory.createForClass(Storage)
