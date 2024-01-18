import React, { useEffect, useState } from "react";
import axios from "axios";
import { BoardDto } from "../../dto/Board";
import { Container, Row, Col, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Board.css"; // Import your custom CSS file
import Team from "../team/Team";

const Board: React.FC = () => {
  const [board, setBoard] = useState<Array<BoardDto>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    getBoard();
  }, []);

  const getBoard = async (page = 1) => {
    try {
      const res = await axios.get(
          `http://51.21.48.160:8080/api/posts?type=PC_GAME&game=LEAGUE_OF_LEGEND&board=FREE_BOARD&page=${page}&size=10&sortKey=createdAt&isAsc=false`
      );
      console.log(res);
      setBoard(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  // 페이지 변경
  const handlePageChange = (newPage: number) => {
    getBoard(newPage);
  };

  return (
      <Container>
        <Row>
          <Col md={8}>
            <Table striped bordered hover responsive className="table">
              <thead>
              <tr>
                <th>ID</th>
                <th className="title-column">제목</th>
                <th className="author-column">작성자</th>
                <th className="like-column">좋아요</th>
                <th className="unlike-column">싫어요</th>
                <th className="createAt-column">작성일</th>
              </tr>
              </thead>
              <tbody>
              {board.map((board: BoardDto) => (
                  <tr key={board.postId}>
                    <td>{board.postId}</td>
                    <td>
                      <Link to={`/api/posts/${board.postId}`}>{board.postTitle}</Link>
                    </td>
                    <td>{board.postAuthor}</td>
                    <td>{board.postLike}</td>
                    <td>{board.postUnlike}</td>
                    <td>{board.createdAt}</td>
                  </tr>
              ))}
              </tbody>
            </Table>
          </Col>
          <Col md={4}>
            <div>
              <Team />
            </div>
          </Col>
        </Row>
      </Container>
  );
};

export default Board;
