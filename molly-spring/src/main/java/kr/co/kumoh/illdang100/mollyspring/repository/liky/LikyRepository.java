package kr.co.kumoh.illdang100.mollyspring.repository.liky;

import kr.co.kumoh.illdang100.mollyspring.domain.liky.Liky;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikyRepository extends JpaRepository<Liky, Long> {

    boolean existsByAccountIdAndBoard_Id(Long accountId, Long boardId);
}