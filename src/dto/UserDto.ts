export interface UserDto {
	nickname: string;
	introduction: string;
	profile_url: string;
	guestBookList: GuestBookDto[];
}
  
export interface GuestBookDto {
	id: number;
	content: string;
	nickname: string;
	createdAt: string;
}
