import axios from "axios";
import { useEffect, useState } from "react";
import { BoardDto } from "../../dto/Board";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const Board: React.FC = () => {
  const [board, setBoard] = useState<Array<BoardDto>>([]);

  useEffect(() => {
    getBoard();
  }, []);
 
  const getBoard = async () => {
    const res  = await axios.get('http://localhost:8080/api/posts?type=PC_GAME&game=LEAGUE_OF_LEGEND&board=FREE_BOARD&page=1&size=10&sortKey=createdAt&isAsc=false');
    console.log(res);
    setBoard(res.data.data.content);
  }
 
  return (
    <>
      {
        board.map((board: BoardDto)=>
          <Row>
            <Col>{board.postId}</Col>
            <Col><Link to={`/api/posts/${board.postId}`}>{board.postTitle}</Link></Col>
            <Col>{board.postAuthor}</Col>
            <Col>{board.createdAt}</Col>
          </Row>)
      }
    </>
  );
};

export default Board;
