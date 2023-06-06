package kr.co.kumoh.illdang100.mollyspring.repository.board;

import kr.co.kumoh.illdang100.mollyspring.domain.board.Board;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRepository extends JpaRepository<Board, Long> {
}
