package kr.co.kumoh.illdang100.mollyspring.repository.cat;

import kr.co.kumoh.illdang100.mollyspring.domain.pet.Cat;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CatRepository extends JpaRepository<Cat, Long> {
}
