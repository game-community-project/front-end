import React, { useState, useEffect } from "react";
import axios from "axios";
import { UserDto } from "../../dto/UserDto";
import { Link } from "react-router-dom";

function UserList() {
	const [users, setUsers] = useState<UserDto[]>([]);
	const [loading, setLoading] = useState(true);

	const accessToken = localStorage.getItem('accessToken');
	const refreshToken = localStorage.getItem('refreshToken');

	useEffect(() => {
		const fetchData = async () => {
			try {
				const url = `http://localhost:8080/api/admin/users`;
				const resp = await axios.get(url, {
					headers: {
						access: accessToken,
						refresh: refreshToken,
					}
				});
				const userDtoList: UserDto[] = resp.data.data;
				setUsers(userDtoList);
				setLoading(false);
			} catch (error) {
				if (axios.isAxiosError(error)) {
					alert(error.response?.data?.message || '유저 조회에 실패하였습니다.');
				} else {
					console.error('find user error : ', error);
					alert('유저 조회에 실패하였습니다.');
				}
				setLoading(false);
			}
		};

		fetchData();
	}, [accessToken, refreshToken]);

	return (
		<div>
			<h2>User List</h2>
			{loading ? (
				<p>Loading...</p>
			) : (
				<ul>
					{users.map((user) => (
						<li key={user.nickname}>
							<Link to={`/admin/${user.nickname}`}>
								<strong>{user.nickname}</strong> - {user.email}
							</Link>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default UserList;
