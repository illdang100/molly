package kr.co.kumoh.illdang100.mollyspring.repository.account;

import kr.co.kumoh.illdang100.mollyspring.domain.account.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByUsername(String username);

    Optional<Account> findByNickname(String nickname);
}
