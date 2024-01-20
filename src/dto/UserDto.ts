export interface UserDto {
	id: bigint;
	nickname: string;
	introduction: string;
	profile_url: string;
	guestBookList: GuestBookDto[];
}
  
export interface GuestBookDto {
	id: number;
	//to_user_id: bigint;
	content: string;
	nickname: string;
	createdAt: string;
}
