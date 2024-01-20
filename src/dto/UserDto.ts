export interface UserDto {
	email: string;
	nickname: string;
	introduction: string;
	profile_url: string;
	ranking: number;
	block_date: string;
	guestBookList: GuestBookDto[];
}
  
export interface GuestBookDto {
	id: number;
	content: string;
	nickname: string;
	createdAt: string;
}
