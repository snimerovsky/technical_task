import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {HydratedDocument, Types} from "mongoose";

export enum USER_QUEUE_MESSAGE_TYPE {
    USER_CREATED = 'user_created',
    USER_DELETED = 'user_deleted'
}

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'user' })
export class User {
    @Prop()
    name: string;

    @Prop({unique: true})
    email: string;

    @Prop({ default: Date.now })
    createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('id').get(function(){
    return this._id.toHexString();
})

UserSchema.set('toJSON', {
    virtuals: true
})
