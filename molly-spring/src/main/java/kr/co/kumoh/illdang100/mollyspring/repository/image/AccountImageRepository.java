package kr.co.kumoh.illdang100.mollyspring.repository.image;

import kr.co.kumoh.illdang100.mollyspring.domain.image.AccountImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountImageRepository extends JpaRepository<AccountImage, Long> {

    Optional<AccountImage> findByAccount_id(Long accountId);
}
