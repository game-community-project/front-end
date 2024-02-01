import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { BoardDto } from "../../dto/Board";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Team from "../team/Team";
import "./Board.css";

const Board: React.FC = () => {
  const [board, setBoard] = useState<Array<BoardDto>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:8080/api/posts?type=&page=${currentPage}&size=10&sortKey=createdAt&isAsc=false`
        );
        setBoard((prevBoard) => [...prevBoard, ...res.data.data.content]);
        setTotalPages(res.data.data.totalPages);
      } catch (error) {
        console.error("에러: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); // 초기 렌더링 시 한 번 호출
  }, [currentPage]);

  useEffect(() => {
    const handleScroll = () => {
      if (bottomRef.current && window.innerHeight + window.scrollY >= bottomRef.current.offsetTop) {
        if (!loading && currentPage < totalPages) {
          setCurrentPage((prevPage) => prevPage + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, currentPage, totalPages]);

  return (
    <Container>
      <Row>
        <Col md={8}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>팀원 찾기</h2>
            <Link to="/write_post" className="btn btn-primary">
              글 작성
            </Link>
          </div>
          {board.map((boardItem: BoardDto) => (
            <Link to={`/post/${boardItem.postId}`} key={boardItem.postId} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>
                    {boardItem.postTitle}
                    <span className={`status-indicator ${boardItem.close ? 'closed' : 'open'}`}>
                      {boardItem.close ? 'close' : 'open'}
                    </span>
                  </Card.Title>
                  <hr></hr>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      {/* 작성자 */}
                      <Card.Subtitle className="mb-2 text-muted">{boardItem.postAuthor}</Card.Subtitle>
                    </div>
                    <div>
                      {/* 작성시간 */}
                      <Card.Subtitle className="mb-2 text-muted">
                        {new Date(boardItem.createdAt).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </Card.Subtitle>
                    </div>
                  </div>
                  <hr></hr>
                  <Card.Text>{boardItem.postContent}</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          ))}
          {loading && <p>Loading...</p>}
          <div ref={bottomRef}></div>
        </Col>
        <Col md={4}>
          <div>
            <Team/>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Board;
