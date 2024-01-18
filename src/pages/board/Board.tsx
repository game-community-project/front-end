import axios from "axios";
import { useEffect, useState } from "react";
import { BoardDto } from "../../dto/Board";
import { Container, Row, Col, Table, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Board.css"; // Import your custom CSS file

const Board: React.FC = () => {
  const [board, setBoard] = useState<Array<BoardDto>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBoard, setSelectedBoard] = useState("FREE_BOARD");

  useEffect(() => {
    getBoard();
  }, [selectedBoard, currentPage]);

  const getBoard = async (page = 1) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/posts?type=PC_GAME&game=LEAGUE_OF_LEGEND&board=${selectedBoard}&page=${page}&size=10&sortKey=createdAt&isAsc=false`
      );
      console.log(res);
      setBoard(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const changeBoard = (newBoard: string) => {
    setSelectedBoard(newBoard);
    getBoard();
  };

  // Page change
  const handlePageChange = (newPage: number) => {
    getBoard(newPage);
  };

  const renderPagination = () => {
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
      <div className="pagination">
        {pages.map((page) => (
          <span
            key={page}
            className={page === currentPage ? "active" : ""}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </span>
        ))}
      </div>
    );
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Board</h2>
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            {selectedBoard === "FREE_BOARD" ? "자유 게시판" : "팀원 찾기 게시판"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => changeBoard("FREE_BOARD")}>자유 게시판</Dropdown.Item>
            <Dropdown.Item onClick={() => changeBoard("FIND_USER_BOARD")}>팀원 찾기 게시판</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Link to="/write_post" className="btn btn-primary">
          글 작성
        </Link>
      </div>
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
      {renderPagination()}
    </Container>
  );
};

export default Board;
