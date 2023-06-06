package kr.co.kumoh.illdang100.mollyspring.repository.rabbit;

import kr.co.kumoh.illdang100.mollyspring.domain.pet.Rabbit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RabbitRepository extends JpaRepository<Rabbit, Long> {
}
