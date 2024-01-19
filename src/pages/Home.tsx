import { useEffect, useRef, useState } from "react";
import { Col, Container, Row, Image, Card } from "react-bootstrap";
import img1 from '../images/game_img1.jpg'
import img2 from '../images/game_img2.jpg'
import img3 from '../images/game_img3.jpg'
import img4 from '../images/game_img4.jpg'
import img5 from '../images/game_img5.jpg'
import img6 from '../images/game_img6.jpg'

function Home() {
	return (
		<div>
			<MainGrid />
		</div>
	)
}

export default Home;

function MainGrid() {

	const cards = [
		{ title: 'ChronoSphere: 시간 여행 어드벤처', content: '장르: 어드벤처, 탐험\r\n설명: 플레이어는 고급 기술이 개발된 과학 도시를 탐험하며, 시간 여행을 통해 다양한 시대의 세계를 탐험하는 게임입니다. 역동적인 스토리와 시간을 조작하는 퍼즐이 풀어야 할 고민거리를 제공합니다.', img: img1 },
		{ title: 'Nebula Racer: 은하계 스피드 경주', content: '장르: 레이싱, 우주\r\n설명: 은하계에서 열리는 무한한 우주 레이싱 대회에 참가하세요. 플레이어는 다양한 우주선을 조작하며 다양한 행성과 별들을 횡단하는 긴장감 넘치는 경주를 경험합니다.', img: img2 }, ,
		{ title: 'DreamForge: 창조와 모험의 세계', content: '장르: 생존, 창조\r\n설명: 꿈 속에서 현실을 창조하고 모험에 빠져드는 게임. 창조력을 발휘하여 독특한 세계를 만들고, 다른 플레이어들과 협력하여 모험을 즐기세요.', img: img3 }, ,
		{ title: 'Quantum Heist: 양자력을 이용한 도둑 사냥', content: '장르: 스텔스, 퍼즐\r\n설명: 양자물리학을 이용한 독특한 도둑 사냥 게임. 플레이어는 양자 특수 능력을 활용하여 보안 시스템을 피하고, 양자 상태를 활용하여 보물을 훔치세요.', img: img4 }, ,
		{ title: 'Mystic Realms: 마법과 기술이 공존하는 판타지', content: '장르: RPG, 판타지\r\n설명: 고대의 마법과 미래 기술이 공존하는 세계에서 펼쳐지는 대규모 RPG. 플레이어는 다양한 종족과 직업을 선택하고, 세계를 구하거나 파괴하는 선택을 하세요.', img: img5 }, ,
		{ title: 'Infinite Labyrinth: 무한한 미로를 탐험하라', content: '장르: 어드벤처, 미로\r\n설명: 끝없이 확장되는 미로 속에서 플레이어는 다양한 도전과 퍼즐을 풀며 미로의 중심에 도달해야 합니다. 미로는 플레이어의 행동에 따라 변형되어 계속해서 새로운 도전을 제공합니다.', img: img6 }, ,
	]

	const imageSize = {
		width: '100%',
		height: '100%',
	}

	const textStyle = {
		whiteSpace: 'pre-line'
	}

	return (
		<Row xs={1} md={3} className="g-4">
			{cards.map((card, idx) => (
				<Col key={idx}>
					<Card>
						<Card.Img variant="top" src={card?.img} style={imageSize} />
						<Card.Body>
							<Card.Title>{card?.title}</Card.Title>
							<Card.Text style={textStyle}>
								{card?.content}
							</Card.Text>
						</Card.Body>
					</Card>
				</Col>
			))}
		</Row>
	);
}
