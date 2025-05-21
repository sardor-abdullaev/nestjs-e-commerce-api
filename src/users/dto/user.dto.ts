import { Expose } from "class-transformer";

export class UserDto {
    @Expose()
    id: string;

    @Expose()
    login: string;

    @Expose()
    role: string;
}