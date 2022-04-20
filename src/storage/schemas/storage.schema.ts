import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type StorageDocument = Storage & Document;

@Schema({
  timestamps: true,
})
export class Storage {
  @Prop()
    originalName: string

  @Prop()
    baseName: string

  @Prop()
    extName: string

  @Prop()
    mimeType: string

  @Prop()
    encoding: string

  @Prop()
    size: number

  @Prop()
    MD5Hash: string

  @Prop()
    folderId: string
}

export const StorageSchema = SchemaFactory.createForClass(Storage)
