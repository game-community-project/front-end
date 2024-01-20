import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuth() {

	
	const navigate = useNavigate();

	useEffect(() => {
			
		const access = new URL(window.location.href).searchParams.get('access');
		const refresh = new URL(window.location.href).searchParams.get('refresh');
	
		if( access == null || refresh == null ) {
			return;
		}

		localStorage.setItem('accessToken', access?access:'' );
		localStorage.setItem('refreshToken', refresh?refresh:'' );
	
		navigate('/');
	}, []);


	return (
		<div></div>
	)
}

export default OAuth;
