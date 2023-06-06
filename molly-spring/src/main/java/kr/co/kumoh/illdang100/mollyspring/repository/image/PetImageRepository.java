package kr.co.kumoh.illdang100.mollyspring.repository.image;

import kr.co.kumoh.illdang100.mollyspring.domain.image.PetImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface PetImageRepository extends JpaRepository<PetImage, Long> {

    Optional<PetImage> findByPet_Id(Long petId);
}
