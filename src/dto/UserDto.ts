export interface UserDto {
	nickname: string;
	introduction: string;
	profile_url: string;
	guestBookList: GuestBookDto[];
  }
  
export interface GuestBookDto {
	// GuestBookDto의 필드에 대한 타입을 정의하세요
	id: number;
	content: string;
	nickname: string;
	createdAt: string;
  }