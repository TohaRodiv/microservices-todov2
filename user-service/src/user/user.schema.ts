import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends Document {
	@Prop({ required: true })
	username: string;

	@Prop({ required: true, unique: true })
	email: string;

	@Prop({ required: true })
	password: string;

	@Prop({ default: Date.now })
	createdAt: Date;

	async setPassword(password: string): Promise<void> {
		const salt = await bcrypt.genSalt();
		this.password = await bcrypt.hash(password, salt);
	}
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.setPassword = async function (password: string): Promise<void> {
	const salt = await bcrypt.genSalt();
	this.password = await bcrypt.hash(password, salt);
};