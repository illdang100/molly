package kr.co.kumoh.illdang100.mollyspring.repository.dog;

import kr.co.kumoh.illdang100.mollyspring.domain.pet.Dog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DogRepository extends JpaRepository<Dog, Long> {
}
