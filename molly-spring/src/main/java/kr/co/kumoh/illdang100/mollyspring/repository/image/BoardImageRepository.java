package kr.co.kumoh.illdang100.mollyspring.repository.image;

import kr.co.kumoh.illdang100.mollyspring.domain.image.BoardImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardImageRepository extends JpaRepository<BoardImage, Long> {

    List<BoardImage> findByBoardId(Long boardId);
}
