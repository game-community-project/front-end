import axios from "axios";
import { useEffect, useState } from "react";
import { BoardDto } from "../../dto/Board";
import { Container, Table, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Board.css";

interface BoardProps {
  gameType: string;
  gameName: string;
}

const Board: React.FC<BoardProps> = ({ gameType, gameName }) => {
  const [board, setBoard] = useState<Array<BoardDto>>([]);
  const [selectedBoard, setSelectedBoard] = useState("FREE_BOARD");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let adjustedSelectedBoard = selectedBoard;

        if (gameType === 'EMPTY_TYPE') {
          // 현재 경로가 '/request'인지 확인
          if (window.location.pathname === '/request') {
            adjustedSelectedBoard = 'REQUIRED_BOARD';
          } else {
            // 원하는 경우 다른 기본값으로 설정
            adjustedSelectedBoard = 'GROUP_PROMOTION_BOARD';
          }
        }
        console.log(adjustedSelectedBoard);

        const res = await axios.get(
          `http://localhost:8080/api/posts?type=${gameType}&game=${gameName}&board=${adjustedSelectedBoard}&page=${currentPage}&size=10&sortKey=createdAt&isAsc=false`
        );
        console.log(res);
        setBoard(res.data.data.content);
        console.log(res.data.data.content);
        setTotalPages(res.data.data.totalPages);
      } catch (error) {
        console.error("에러: ", error);
      }
    };

    fetchData(); // 초기 렌더링 시 한 번 호출
  }, [selectedBoard, currentPage]);

  const changeBoard = (newBoard: string) => {
    setSelectedBoard(newBoard);
    setCurrentPage(1); // 게시판 변경 시 현재 페이지를 1로 리셋
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderPagination = () => {
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          이전
        </button>
        {pages.map((page) => (
          <span
            key={page}
            className={page === currentPage ? "active" : ""}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </span>
        ))}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          다음
        </button>
      </div>
    );
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>게시판</h2>
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
            <th className="post-id">ID</th>
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
                <Link to={`/${board.gameType}/${board.gameName}/${board.postId}`}>{board.postTitle}</Link>
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
