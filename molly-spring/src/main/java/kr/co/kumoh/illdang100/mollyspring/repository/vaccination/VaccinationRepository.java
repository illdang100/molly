package kr.co.kumoh.illdang100.mollyspring.repository.vaccination;

import kr.co.kumoh.illdang100.mollyspring.domain.vaccinations.VaccinationHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VaccinationRepository extends JpaRepository<VaccinationHistory, Long>, VaccinationRepositoryCustom {

    List<VaccinationHistory> findByPet_Id(Long petId);

    List<VaccinationHistory> findByPet_IdOrderByVaccinationDateAsc(Long petId);
    
    Optional<VaccinationHistory> findByVaccinationNameAndPet_Id(String vaccinationName, Long petId);
}
